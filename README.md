# ThinAir Data MCP Server

Connect your AI assistant to any **PostgreSQL, MySQL, or SQL Server** database in 60 seconds via MCP.

[![npm version](https://img.shields.io/npm/v/thinair-data)](https://www.npmjs.com/package/thinair-data)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What It Does

ThinAir Data is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that gives AI agents secure, read/write access to your databases — no custom backend required.

- **Multi-database** — PostgreSQL, MySQL, SQL Server
- **Secure** — OAuth 2.1 + API key auth, query sandboxing
- **Fast** — Low-latency edge infrastructure with connection pooling
- **AI-ready** — Schema introspection, natural language to SQL

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
      "args": ["thinair-data"],
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
      "args": ["thinair-data"],
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

- *"Show me all vehicles that haven't pinged in the last 24 hours"*
- *"What are the top 10 routes by mileage this month?"*
- *"List all open maintenance tickets ordered by priority"*
- *"How many active drivers do we have per region?"*

## npm Package

[npmjs.com/package/thinair-data](https://www.npmjs.com/package/thinair-data)

## Get an API Key

Sign up at [thinair.co](https://thinair.co) to get your free API key.

## License

MIT © [ThinAir Telematics](https://thinair.co)
