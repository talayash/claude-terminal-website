// Same-origin proxy for the ct-analytics Worker /stats endpoint.
// The Worker now requires x-ct-token; we hold the token server-side in
// CT_STATS_TOKEN (Vercel env var) so it never reaches the browser.

export const config = { runtime: 'edge' };

const WORKER_URL = 'https://ct-analytics.claude-terminal.workers.dev/stats';

export default async function handler() {
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
