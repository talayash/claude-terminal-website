// Same-origin proxy for the ct-analytics Worker /stats/history endpoint.
// Validates the metric and days params before forwarding so we never proxy
// arbitrary query strings into the worker.

export const config = { runtime: 'edge' };

const WORKER_BASE = 'https://ct-analytics.claude-terminal.workers.dev/stats/history';
const ALLOWED_METRICS = new Set(['dau', 'heartbeats', 'update_checks', 'version', 'os', 'country']);
const MAX_DAYS = 365;

export default async function handler(request) {
  const token = process.env.CT_STATS_TOKEN;
  if (!token) {
    return jsonError(500, 'server_misconfigured', 'CT_STATS_TOKEN not set');
  }

  const url = new URL(request.url);
  const metric = url.searchParams.get('metric') ?? 'dau';
  const daysParam = url.searchParams.get('days') ?? '30';

  if (!ALLOWED_METRICS.has(metric)) {
    return jsonError(400, 'invalid_metric', `metric must be one of ${[...ALLOWED_METRICS].join(', ')}`);
  }
  const days = Math.min(Math.max(parseInt(daysParam, 10) || 30, 1), MAX_DAYS);

  const upstreamUrl = `${WORKER_BASE}?metric=${encodeURIComponent(metric)}&days=${days}`;

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: { 'x-ct-token': token },
      cache: 'no-store',
    });
  } catch (err) {
    return jsonError(502, 'upstream_unreachable', String(err));
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

function jsonError(status, error, detail) {
  return new Response(
    JSON.stringify({ error, detail }),
    { status, headers: { 'content-type': 'application/json' } },
  );
}
