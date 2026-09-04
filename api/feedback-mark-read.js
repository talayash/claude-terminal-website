// Same-origin proxy for the ct-analytics Worker /feedback/mark_read endpoint.
// Holds CT_STATS_TOKEN server-side so it never reaches the browser.

export const config = { runtime: 'edge' };

const WORKER_URL = 'https://ct-analytics.claude-terminal.workers.dev/feedback/mark_read';

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
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  const authDenied = requireBasicAuth(request);
  if (authDenied) return authDenied;

  const token = process.env.CT_STATS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'server_misconfigured', detail: 'CT_STATS_TOKEN not set' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  let upstream;
  try {
    upstream = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'x-ct-token': token,
        'content-type': 'application/json',
      },
      body: await request.text(),
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
