# ThinAir Data MCP Server

**The only MCP database server for PostgreSQL, MySQL, and SQL Server in one session** — 23 dialect-aware tools across 4 tiers, from schema introspection to cross-database compare, query firewall, PII scanning, and N+1 detection. Read-only by design.

[![npm version](https://img.shields.io/npm/v/@thinairtelematics/data)](https://www.npmjs.com/package/@thinairtelematics/data)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![smithery badge](https://smithery.ai/badge/thinair/data)](https://smithery.ai/servers/thinair/data)

## What It Does

ThinAir Data is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that gives AI agents secure, **read-only** access to your databases — no custom backend required. Three independent enforcement layers (SQL guard, session `READ ONLY`, optional per-connection custom firewall) reject `INSERT` / `UPDATE` / `DELETE` / `DROP` / `ALTER` before they hit your DB. Safe to point any agent at production.

- **Multi-database** — PostgreSQL, MySQL, SQL Server in a single session. Cross-database compare with one tool call.
- **Read-only by design** — three-layer enforcement; write statements never reach your DB.
- **Dialect-aware** — every tool understands `SELECT TOP 10` (mssql) vs `LIMIT` (others) and routes syntax correctly per connection.
- **Tiered capability** — 23 tools across 4 tiers: schema introspection, query execution + history, EXPLAIN/optimization, anomaly detection, PII scanning, N+1 detection, query firewall, cross-DB compare.
- **Connections are managed at runtime** — added per-tenant via the `add_connection` tool after sign-in. Never an env var or install-time config.

## Product Links

- **Main:** https://data.thinair.co
- **Connect a database:** https://data.thinair.co/connect
- **Docs:** https://data.thinair.co/docs/getting-started
- **Pricing:** https://data.thinair.co/checkout

## Tools (selected — full list of 23 in [docs](https://data.thinair.co/docs/tools))

| Tool | Tier | Description |
|------|------|-------------|
| `list_connections` | discover | List connected databases with names + dialects |
| `describe_schema` | discover | Get schema, columns, indexes, FKs across any connection |
| `query_sql` | discover | Execute a parameterized read-only SQL query |
| `query_history` | build | Recent queries with timing, row counts, status |
| `data_profile` | build | Distributions, null rates, cardinality on a table |
| `cross_db_query` | architect | Run the same query across 2–4 connections (regional/dialect compare) |
| `detect_anomalies` | architect | Statistical outliers in row growth, latency, value distributions |
| `pii_scan` | architect | Scan a table for PII patterns (SSN, email, phone, credit card) |
| `find_n_plus_one` | architect | Identify N+1 query patterns in `query_history` |
| `query_firewall` | architect | Per-connection custom-block rules (deny specific tables/queries) |

`add_connection`, `query_optimize`, `explain_query`, `suggest_queries`, `generate_migration`, `watch_table`, `saved_queries`, `impact_analysis`, and others round out the 23-tool surface.

## Quick Start

### Claude Desktop, Cursor, Windsurf — OAuth (recommended, keyless)

Add to your client's MCP config (e.g. `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "thinair-data": {
      "url": "https://data.thinair.co/mcp"
    }
  }
}
```

The OAuth flow completes at first use — no manual token setup required. After sign-in, your agent calls `add_connection` to register a database with its DSN — connections are tenant-scoped and reusable across sessions.

### API key (for non-OAuth clients)

```json
{
  "mcpServers": {
    "thinair-data": {
      "url": "https://data.thinair.co/mcp",
      "headers": {
        "Authorization": "Bearer ta_live_..."
      }
    }
  }
}
```

Get a key at https://data.thinair.co/connect.

### npx (CLI / scripts)

```bash
npx -y @thinairtelematics/data
```

Prints a config block to stdout. OAuth-keyless by default.

## Supported Databases

Database connections are added at **runtime** via the `add_connection` MCP tool — pass the DSN once, the connection becomes a named resource the agent can reuse across sessions. Three dialects supported:

| Database | Connection string format |
|----------|--------------------------|
| PostgreSQL | `postgresql://user:pass@host:5432/db` |
| MySQL | `mysql://user:pass@host:3306/db` |
| SQL Server | `sqlserver://user:pass@host:1433/db` |

You do **not** put a DSN in your client's config. The `add_connection` tool is how connections enter the session.

## Example Usage

Once connected, ask your AI:

- *"Show me all rows that haven’t updated in the last 24 hours across staging and prod"*
- *"What are the top 10 slowest queries this week?"*
- *"Scan the customers table for PII patterns"*
- *"Which tables have the most N+1 query exposure?"*

## npm Package

[npmjs.com/package/@thinairtelematics/data](https://www.npmjs.com/package/@thinairtelematics/data)

> Previously published as `thinair-data` (now deprecated in favor of the scoped package).

## License

MIT © [ThinAir Telematics](https://thinair.co)
