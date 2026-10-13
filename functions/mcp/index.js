// MCP (Streamable HTTP) endpoint at /mcp, served by docusaurus-plugin-mcp-server.
// The bundle is written by `npm run build`, which Pages runs before compiling Functions.
import {createWebRequestHandler} from 'docusaurus-plugin-mcp-server/adapters';
import bundle from '../../build/mcp/bundle.json';

const handler = createWebRequestHandler({artifacts: bundle});

export const onRequest = ({request}) => handler(request);
