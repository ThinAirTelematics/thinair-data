# ThinAir Data MCP Server

Connect your AI assistant to any **PostgreSQL, MySQL, or SQL Server** database in 60 seconds via MCP.

[![npm version](https://img.shields.io/npm/v/@thinairtelematics/data)](https://www.npmjs.com/package/@thinairtelematics/data)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What It Does

ThinAir Data is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that gives AI agents secure, **read-only** access to your databases — no custom backend required. SELECT / WITH / EXPLAIN are permitted; INSERT / UPDATE / DELETE / DROP / ALTER are blocked at the query firewall.

- **Multi-database** — PostgreSQL, MySQL, SQL Server
- **Read-only by design** — write statements rejected before they hit your DB; safe to point any agent at production
- **Secure** — OAuth 2.1 + API key auth, query sandboxing, per-tenant connection pooling
- **AI-ready** — Schema introspection, dialect-aware tools, natural language to SQL

## Product Links

- **Main:** https://data.thinair.co
- **Connect a database:** https://data.thinair.co/connect
- **Docs:** https://data.thinair.co/docs/getting-started
- **Pricing:** https://data.thinair.co/checkout

## Tools

| Tool | Description |
|------|-------------|
| `query` | Execute a SQL query and return results |
| `list_tables` | List all tables in the database |
| `describe_table` | Get schema and column details for a table |
| `list_databases` | List available databases/schemas |
| `execute` | Run INSERT, UPDATE, DELETE statements |

## Quick Start

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "thinair-data": {
      "command": "npx",
      "args": ["-y", "@thinairtelematics/data"],
      "env": {
        "THINAIR_API_KEY": "your-api-key",
        "DATABASE_URL": "postgresql://user:pass@host:5432/dbname"
      }
    }
  }
}
```

### Cursor / Windsurf / Other MCP Clients

```json
{
  "mcpServers": {
    "thinair-data": {
      "command": "npx",
      "args": ["-y", "@thinairtelematics/data"],
      "env": {
        "THINAIR_API_KEY": "your-api-key",
        "DATABASE_URL": "postgresql://user:pass@host:5432/dbname"
      }
    }
  }
}
```

### Remote / Streamable HTTP

```json
{
  "mcpServers": {
    "thinair-data": {
      "type": "http",
      "url": "https://data.thinair.co/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

## Supported Databases

| Database | Connection String Format |
|----------|-------------------------|
| PostgreSQL | `postgresql://user:pass@host:5432/db` |
| MySQL | `mysql://user:pass@host:3306/db` |
| SQL Server | `sqlserver://user:pass@host:1433/db` |

## Example Usage

Once connected, ask your AI:

- *"Show me all vehicles that haven’t pinged in the last 24 hours"*
- *"What are the top 10 routes by mileage this month?"*
- *"List all open maintenance tickets ordered by priority"*
- *"How many active drivers do we have per region?"*

## npm Package

[npmjs.com/package/@thinairtelematics/data](https://www.npmjs.com/package/@thinairtelematics/data)

> Previously published as `thinair-data` (now deprecated in favor of the scoped package).

## License

MIT © [ThinAir Telematics](https://thinair.co)
