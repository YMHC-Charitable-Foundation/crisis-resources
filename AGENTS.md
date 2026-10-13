# AGENTS.md

Instructions for AI coding agents working in this repository.

## What this is

The **YMHC Crisis Resources Directory** (https://crisis.ymhc.ngo) is a Docusaurus 3 static site that
lists Canadian crisis lines and mental health supports. It is published by Youth Mental Health Canada.
**The site is not a crisis service.** People in distress may rely on its contents, so accuracy
matters more than anything else.

## Git workflow

1. **Before changing anything**, run `git fetch` and `git pull --ff-only` so you work on the latest `master`.
2. Make the change, then build (see below).
3. Commit only the files you changed. Stage them by path, not with `git add -A`. The working tree may
   contain the maintainer's unrelated uncommitted edits.
4. Push to `origin master`. Cloudflare Pages builds and deploys every push to `master` automatically.

## Secrets

- `tmp/` (git-ignored) may hold local Cloudflare credentials. **Never** print, commit, or copy them
  anywhere, including the repo, commit messages, logs, or other files.
- Before committing, check that `git status` shows nothing under `tmp/`.

## Content rules (docs/)

- One Markdown file per service in `docs/canada-nationwide/` or `docs/provincial-territorial/<Province>/`.
  Each file has `title` and `sidebar_label` frontmatter.
- Each service page follows the existing sections (About, Coverage, Who it's for, Contact, Hours,
  Languages, …, Sources) and ends with a `*Last compiled/checked: <date>*` line.
- Phone numbers, hours, and eligibility must come from the official sources listed on the page. Never guess.
- **Removing a service** (for example, defunded or closed): delete its `.md` file **and** remove its link from
  that folder's `index.md`. Then search the repo for the name to catch other references.
- Each folder's `index.md` has a `## Resources` list (`## Ressources` in Quebec). `update_indices.py`
  can regenerate these lists, but its `DOCS_DIR` is a hard-coded Windows path, so it does nothing on
  Linux or Cloudflare. Edit index lists by hand.
- Quebec pages are written in French. Keep them in French.

## Build and run

Requires Node 22+ (`.nvmrc` → 24). Use npm, not yarn.

```bash
npm ci
npx docusaurus build        # → build/  (`npm run build` also runs update_indices.py via `python`)
npx wrangler pages dev      # serve build/ + Pages Functions locally on :8788
```

The build must pass. `onBrokenLinks: 'throw'` fails the build on any broken internal link.

## Hosting (Cloudflare Pages, project `crisis-resources`)

- Pages runs `npm run build`, serves `build/`, and compiles `functions/` (Pages Functions).
- `wrangler.jsonc` holds the Pages config (`pages_build_output_dir`, `compatibility_date`, `nodejs_compat`).
- The Pages project sets `NODE_VERSION=24`.
- Zone `ymhc.ngo` is on the Free plan, so Cloudflare's built-in "Markdown for Agents" isn't available.
  `functions/_middleware.js` does the Markdown negotiation instead.

## Agent-readiness features (target: 100% at https://isitagentready.com/crisis.ymhc.ngo?profile=content)

| Feature | Where it comes from |
| --- | --- |
| `robots.txt` with AI bot rules, `Content-Signal: search=yes, ai-input=yes, ai-train=no`, Sitemap, Agentmap | `static/robots.txt` |
| `sitemap.xml` | Docusaurus preset (automatic) |
| `llms.txt`, `llms-full.txt`, a `.md` copy of every page | `docusaurus-plugin-llms` (config in `docusaurus.config.js`) |
| `Accept: text/markdown` → Markdown response, `x-markdown-tokens` | `functions/_middleware.js` |
| `Link` headers on `/` (api-catalog, service-doc, describedby, service-desc) | `functions/_middleware.js` |
| MCP server at `/mcp` (`docs_search`, `docs_fetch`) | `docusaurus-plugin-mcp-server` → `build/mcp/bundle.json`, served by `functions/mcp/index.js` |
| `/.well-known/mcp/server-card.json`, `/mcp/server-card` | `plugins/agent-discovery.js`, `functions/mcp/server-card.js` |
| `/.well-known/agent-skills/index.json` (+ sha256 digests) | `plugins/agent-discovery.js` from `skills/*/SKILL.md` |
| `/.well-known/api-catalog` (RFC 9727), `/.well-known/ai-catalog.json` (ARD) | `plugins/agent-discovery.js` |
| `_headers` (content types, CORS for discovery files) | `plugins/agent-discovery.js` |
| WebMCP tools (`search_crisis_resources`, `get_crisis_resource`) | `src/clientModules/webmcp.js` |
| DNS-AID: SVCB `_index._agents.crisis` and `_mcp._agents.crisis`, TXT `_catalog._agents.crisis` (DNSSEC on) | Cloudflare DNS, zone `ymhc.ngo` (not in this repo) |

The robots.txt policy is deliberate: search crawlers and user-triggered AI fetchers are allowed, and
AI **training** crawlers are disallowed (outdated numbers baked into models are a safety risk). Don't
change it without the maintainer's approval.

When you change a skill in `skills/`, rebuild. Its digest in the index is recomputed automatically.

### Verify after deploy

```bash
curl -s -X POST https://isitagentready.com/api/scan -H 'Content-Type: application/json' \
  -d '{"url":"https://crisis.ymhc.ngo","profile":"content"}'
curl -sI -H 'Accept: text/markdown' https://crisis.ymhc.ngo/      # content-type: text/markdown
curl -s https://crisis.ymhc.ngo/mcp                               # {"initialized":true,...}
```

## Upgrading dependencies

- `npm outdated`, then bump `@docusaurus/*` together (all to the same exact version).
- After upgrading, run `npx docusaurus build` and `npx wrangler pages dev`, and check `/`, a service page,
  `/mcp`, and the Markdown negotiation.
