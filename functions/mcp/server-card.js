// SEP-2127 reserves <streamable-http-url>/server-card; serve the same card as /.well-known.
export const onRequest = async ({request, env}) => {
  const card = await env.ASSETS.fetch(new URL('/.well-known/mcp/server-card.json', request.url));
  return new Response(card.body, {
    status: card.status,
    headers: {
      'content-type': 'application/mcp-server-card+json',
      'access-control-allow-origin': '*',
    },
  });
};
