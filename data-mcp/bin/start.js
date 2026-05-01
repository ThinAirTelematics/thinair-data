#!/usr/bin/env node
// @thinairtelematics/data-mcp — config printer for the hosted MCP server.
//
// Not a local server. This binary prints a ready-to-paste MCP client config
// for https://data.thinair.co/mcp, with optional API-key embedding. Your
// MCP client (Claude Desktop, Cursor, Copilot, Cline, Continue, Perplexity,
// Zed, …) handles the actual MCP protocol — speaking URL transport to our
// Cloudflare-hosted worker.
//
// Usage:
//   npx @thinairtelematics/data-mcp                   # keyless (OAuth on first call)
//   npx @thinairtelematics/data-mcp --api-key <key>   # with x-api-key header
//   npx @thinairtelematics/data-mcp --help

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(`
@thinairtelematics/data-mcp — config printer for the ThinAir Data MCP server.

USAGE
  npx @thinairtelematics/data-mcp [OPTIONS]

OPTIONS
  --api-key <key>    Embed an existing ta_data_* key in the x-api-key header.
                     Omit for OAuth 2.1 (your client opens a browser tab on
                     the first tool call and caches the token locally).
  -h, --help         Print this help.

OUTPUT
  Prints a JSON MCP-server block to stdout. Paste into:
    Claude Desktop  ~/Library/Application Support/Claude/claude_desktop_config.json
    Cursor          ~/.cursor/mcp.json
    Windsurf        ~/.codeium/windsurf/mcp_config.json
    Cline           ~/.config/cline/mcp_settings.json

GETTING A KEY
  No key needed for most users — OAuth 2.1 handles auth on the first
  tool call. Your MCP client opens a browser tab, you paste a DSN at
  /authorize once, and the bearer token is cached locally.

  Need a persistent key (CI, scripts, non-OAuth clients)? Once your
  client is connected, ask it:
      "Call the issue_api_key tool"
  and paste the returned ta_data_* into the --api-key flag. Paid plans
  at https://data.thinair.co/checkout.

DOCS
  Full docs     https://data.thinair.co/docs/getting-started
  Landing       https://data.thinair.co

`);
  process.exit(0);
}

const keyFlagIdx = args.indexOf("--api-key");
const apiKey = keyFlagIdx !== -1 ? args[keyFlagIdx + 1] : null;

const serverBlock = {
  type: "url",
  url: "https://data.thinair.co/mcp",
};
if (apiKey) {
  serverBlock.headers = { "x-api-key": apiKey };
}

const config = { mcpServers: { "thinair-data": serverBlock } };

process.stdout.write("\n");
if (apiKey) {
  process.stdout.write("API-key config (non-OAuth clients, CI, curl):\n\n");
} else {
  process.stdout.write("Keyless config — OAuth 2.1 (recommended):\n");
  process.stdout.write("On first tool call your MCP client opens a browser tab\n");
  process.stdout.write("to authorize, then caches the bearer token locally.\n\n");
}
process.stdout.write(JSON.stringify(config, null, 2) + "\n\n");
process.stdout.write("Paste into your MCP client config, then restart the client.\n");
if (!apiKey) {
  process.stdout.write("No key needed — OAuth handles auth on the first tool call. Need a\n");
  process.stdout.write("persistent key? Once connected, ask your client to call issue_api_key.\n");
}
process.stdout.write("Docs: https://data.thinair.co/docs/getting-started\n\n");
