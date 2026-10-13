// Writes agent-discovery metadata into the build output:
//   /.well-known/agent-skills/index.json (+ SKILL.md files, with sha256 digests)
//   /.well-known/api-catalog            (RFC 9727 linkset)
//   /.well-known/ai-catalog.json        (ARD / AI Catalog)
//   /.well-known/mcp/server-card.json   (MCP Server Card, SEP-2127)
//   /_headers                           (Cloudflare Pages content types / CORS)
// Skills are authored in /skills/<name>/SKILL.md.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sha256 = (data) => `sha256:${crypto.createHash('sha256').update(data).digest('hex')}`;

function readSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = path.join(skillsDir, entry.name, 'SKILL.md');
      const content = fs.readFileSync(file);
      const frontmatter = content.toString('utf8').match(/^---\n([\s\S]*?)\n---/);
      const field = (key) => frontmatter?.[1].match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1].trim();
      if (field('name') !== entry.name) {
        throw new Error(`skills/${entry.name}/SKILL.md: frontmatter name must be "${entry.name}"`);
      }
      return {name: entry.name, description: field('description'), content};
    });
}

module.exports = function agentDiscoveryPlugin(context, options) {
  const {siteConfig, siteDir} = context;
  const site = siteConfig.url.replace(/\/$/, '');
  const host = new URL(site).host;
  const {mcpServerName, representativeQueries = []} = options;

  return {
    name: 'agent-discovery',
    async postBuild({outDir}) {
      const write = (rel, data) => {
        const file = path.join(outDir, rel);
        fs.mkdirSync(path.dirname(file), {recursive: true});
        fs.writeFileSync(file, typeof data === 'string' || Buffer.isBuffer(data) ? data : `${JSON.stringify(data, null, 2)}\n`);
      };

      // Agent Skills discovery index (Agent Skills Discovery RFC v0.2.0)
      const skills = readSkills(path.join(siteDir, 'skills'));
      for (const skill of skills) write(`.well-known/agent-skills/${skill.name}/SKILL.md`, skill.content);
      write('.well-known/agent-skills/index.json', {
        $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
        skills: skills.map((skill) => ({
          name: skill.name,
          type: 'skill-md',
          description: skill.description,
          url: `/.well-known/agent-skills/${skill.name}/SKILL.md`,
          digest: sha256(skill.content),
        })),
      });

      // MCP Server Card
      const serverCard = {
        $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
        name: `${host.split('.').reverse().join('.')}/${mcpServerName}`,
        version: options.mcpServerVersion,
        title: siteConfig.title,
        description:
          'Search and read the YMHC Crisis Resources Directory: Canadian crisis lines and mental health supports, nationwide and by province/territory. Not a crisis service: in an emergency call 9-1-1, or call/text 9-8-8.',
        websiteUrl: site,
        serverInfo: {name: mcpServerName, version: options.mcpServerVersion},
        endpoint: `${site}/mcp`,
        transport: {type: 'streamable-http', endpoint: `${site}/mcp`},
        remotes: [{type: 'streamable-http', url: `${site}/mcp`}],
        capabilities: {tools: {listChanged: false}, resources: {}},
        tools: [
          {name: 'docs_search', description: 'Full-text search across every directory page.'},
          {name: 'docs_fetch', description: 'Fetch one directory page (or one #section) as Markdown.'},
        ],
        authentication: {required: false},
      };
      write('.well-known/mcp/server-card.json', serverCard);

      // RFC 9727 API catalog (linkset)
      write('.well-known/api-catalog', {
        linkset: [
          {
            anchor: `${site}/mcp`,
            'service-desc': [{href: `${site}/.well-known/mcp/server-card.json`, type: 'application/json'}],
            'service-doc': [{href: `${site}/llms.txt`, type: 'text/plain'}],
            status: [{href: `${site}/mcp`, type: 'application/json'}],
          },
          {
            anchor: `${site}/`,
            'service-doc': [{href: `${site}/llms.txt`, type: 'text/plain'}],
            describedby: [{href: `${site}/llms-full.txt`, type: 'text/plain'}],
            item: [{href: `${site}/sitemap.xml`, type: 'application/xml'}],
          },
        ],
      });

      // ARD / AI Catalog
      write('.well-known/ai-catalog.json', {
        specVersion: '1.0',
        host: {displayName: 'Youth Mental Health Canada (YMHC)', identifier: `did:web:${host}`, url: site},
        entries: [
          {
            identifier: `urn:air:${host}:mcp:${mcpServerName}`,
            displayName: `${siteConfig.title} MCP server`,
            type: 'application/mcp-server-card+json',
            url: `${site}/.well-known/mcp/server-card.json`,
            representativeQueries,
          },
          ...skills.map((skill) => ({
            identifier: `urn:air:${host}:skill:${skill.name}`,
            displayName: `${siteConfig.title} agent skill: ${skill.name}`,
            type: 'text/markdown',
            url: `${site}/.well-known/agent-skills/${skill.name}/SKILL.md`,
            description: skill.description,
            representativeQueries,
          })),
          {
            identifier: `urn:air:${host}:docs:llms-txt`,
            displayName: `${siteConfig.title} (llms.txt)`,
            type: 'text/plain',
            url: `${site}/llms.txt`,
            representativeQueries,
          },
        ],
      });

      // Cloudflare Pages static asset headers
      write(
        '_headers',
        [
          '/.well-known/*',
          '  Access-Control-Allow-Origin: *',
          '/.well-known/api-catalog',
          '  Content-Type: application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
          '/.well-known/ai-catalog.json',
          '  Content-Type: application/json',
          '/.well-known/agent-skills/*.md',
          '  Content-Type: text/markdown; charset=utf-8',
          '/llms.txt',
          '  Access-Control-Allow-Origin: *',
          '/llms-full.txt',
          '  Access-Control-Allow-Origin: *',
          '/robots.txt',
          '  Content-Type: text/plain; charset=utf-8',
          '',
        ].join('\n'),
      );
    },
  };
};
