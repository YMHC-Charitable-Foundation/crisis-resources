# YMHC Crisis Resources Directory

Source for https://crisis.ymhc.ngo, a directory of Canadian crisis lines and mental health supports
published by Youth Mental Health Canada. Built with [Docusaurus](https://docusaurus.io/) and hosted on
Cloudflare Pages. **This directory is not a crisis service.**

## Development

Requires Node 22+.

```bash
npm ci
npm start                   # dev server
npx docusaurus build        # production build → build/
npx wrangler pages dev      # serve build/ with the Pages Functions (MCP, Markdown negotiation)
```

## Deployment

Pushing to `master` deploys automatically through Cloudflare Pages.

## For AI agents

- Directory index: https://crisis.ymhc.ngo/llms.txt (full text: `/llms-full.txt`)
- Any page as Markdown: append `.md`, or send `Accept: text/markdown`
- MCP server: `https://crisis.ymhc.ngo/mcp`
- Agent skill: https://crisis.ymhc.ngo/.well-known/agent-skills/index.json

Contributor and coding-agent instructions are in [AGENTS.md](./AGENTS.md).
