// Same-origin proxy for the ct-analytics Worker /feedback/list endpoint.
// Holds CT_STATS_TOKEN server-side so it never reaches the browser.

export const config = { runtime: 'edge' };

const WORKER_BASE = 'https://ct-analytics.claude-terminal.workers.dev/feedback/list';

// HTTP Basic Auth gate. Returns a 401 Response (which the browser turns into
// a login prompt) or null when the credentials match INBOX_PASSWORD.
// Fixed username 'admin' - only the password is a secret.
function requireBasicAuth(request) {
  const password = process.env.INBOX_PASSWORD;
  if (!password) {
    return new Response(
      JSON.stringify({ error: 'server_misconfigured', detail: 'INBOX_PASSWORD not set' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
  const header = request.headers.get('authorization') ?? '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try {
      decoded = atob(encoded);
    } catch {
      // fall through to 401
    }
    const [user, pass] = decoded.split(':');
    if (user === 'admin' && pass === password) return null;
  }
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: {
      'content-type': 'application/json',
      'www-authenticate': 'Basic realm="Agentrium inbox", charset="UTF-8"',
    },
  });
}

export default async function handler(request) {
  const authDenied = requireBasicAuth(request);
  if (authDenied) return authDenied;

  const token = process.env.CT_STATS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'server_misconfigured', detail: 'CT_STATS_TOKEN not set' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  // Forward known query params so /inbox can pass limit + unread_only through.
  const url = new URL(request.url);
  const upstreamUrl = new URL(WORKER_BASE);
  const limit = url.searchParams.get('limit');
  const unreadOnly = url.searchParams.get('unread_only');
  if (limit) upstreamUrl.searchParams.set('limit', limit);
  if (unreadOnly) upstreamUrl.searchParams.set('unread_only', unreadOnly);

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: { 'x-ct-token': token },
      cache: 'no-store',
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'upstream_unreachable', detail: String(err) }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    );
  }

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  });
}
