// Cloudflare Pages middleware: Markdown content negotiation (Accept: text/markdown)
// and agent-discovery Link headers. Markdown files are generated at build time by
// docusaurus-plugin-llms next to each page (/foo/bar -> /foo/bar.md).

const DISCOVERY_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</llms.txt>; rel="service-doc"; type="text/plain"',
  '</.well-known/ai-catalog.json>; rel="describedby"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"',
].join(', ');

const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no';

function wantsMarkdown(request) {
  return /(^|,)\s*text\/markdown\s*(;(?!\s*q=0(\.0+)?\s*($|,))[^,]*)?($|,)/i.test(request.headers.get('accept') || '');
}

function markdownCandidates(pathname) {
  if (pathname === '/' || pathname === '/index.html') return ['/index.md', '/docs.md'];
  const clean = pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '');
  return [`${clean}.md`];
}

async function markdownResponse(request, env, url) {
  for (const candidate of markdownCandidates(url.pathname)) {
    const asset = await env.ASSETS.fetch(new URL(candidate, url.origin));
    const type = asset.headers.get('content-type') || '';
    if (!asset.ok || type.includes('text/html')) continue;
    const body = await asset.text();
    const headers = new Headers({
      'content-type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(Math.ceil(body.length / 4)),
      'content-signal': CONTENT_SIGNAL,
      'content-location': candidate,
      'cache-control': 'public, max-age=0, must-revalidate',
      'access-control-allow-origin': '*',
      vary: 'Accept',
    });
    if (url.pathname === '/') headers.set('link', DISCOVERY_LINKS);
    return new Response(request.method === 'HEAD' ? null : body, {status: 200, headers});
  }
  return null;
}

export async function onRequest(context) {
  const {request, env, next} = context;
  const url = new URL(request.url);
  const isRead = request.method === 'GET' || request.method === 'HEAD';
  const isPage = !/\.[a-z0-9]+$/i.test(url.pathname) || url.pathname.endsWith('.html');

  if (isRead && isPage && !url.pathname.startsWith('/mcp') && wantsMarkdown(request)) {
    const markdown = await markdownResponse(request, env, url);
    if (markdown) return markdown;
  }

  const response = await next();
  const type = response.headers.get('content-type') || '';

  if (url.pathname.endsWith('.md') && response.ok && !type.includes('text/html')) {
    const res = new Response(response.body, response);
    res.headers.set('content-type', 'text/markdown; charset=utf-8');
    res.headers.set('content-signal', CONTENT_SIGNAL);
    res.headers.set('access-control-allow-origin', '*');
    return res;
  }

  if (type.includes('text/html')) {
    const res = new Response(response.body, response);
    res.headers.append('vary', 'Accept');
    if (url.pathname === '/' && !(res.headers.get('link') || '').includes('api-catalog')) {
      res.headers.append('link', DISCOVERY_LINKS);
    }
    return res;
  }

  return response;
}
