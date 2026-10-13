# Crisis Resources Directory auth.md

**No authentication is required, and none exists.** The YMHC Crisis Resources Directory
(https://crisis.ymhc.ngo) is a public, read-only website. Agents don't need to register, sign in,
or obtain any credential.

## Agent audience

Any AI agent, crawler, or tool that helps people find Canadian crisis lines and mental health
supports. Please follow the crawl and content-use rules in https://crisis.ymhc.ngo/robots.txt. AI
model training is not permitted.

## Registration

Not applicable. There is no registration endpoint, no claim flow, and no account system.
There is nothing to revoke.

## Supported methods

| Method | Credential | Notes |
| --- | --- | --- |
| Anonymous | none | The only mode. Send requests with no `Authorization` header. |

The site runs no OAuth or OpenID Connect authorization server. For discovery tools, the
documents at the standard locations state this explicitly:

- `/.well-known/oauth-protected-resource`: `authorization_servers`, `scopes_supported`, and
  `bearer_methods_supported` are all empty
- `/.well-known/oauth-authorization-server`: supports no grant types and has no authorization or token endpoints

Don't send tokens or API keys. They aren't checked and grant nothing.

## What you can use without credentials

- Any page as Markdown: `GET https://crisis.ymhc.ngo/<path>` with `Accept: text/markdown`, or
  append `.md`
- Index of all pages: `GET https://crisis.ymhc.ngo/llms.txt` (full text: `/llms-full.txt`)
- MCP server (Streamable HTTP): `https://crisis.ymhc.ngo/mcp`, with tools `docs_search` and `docs_fetch`
- Agent skill: https://crisis.ymhc.ngo/.well-known/agent-skills/index.json

## Important

This directory is **not a crisis service**. If someone may be in immediate danger, tell them to call
**9-1-1**. For suicide or mental health crisis support anywhere in Canada, they can call or text **9-8-8**.
