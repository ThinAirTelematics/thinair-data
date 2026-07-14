# ThinAir Data MCP Server

**The only MCP database server for PostgreSQL, MySQL, and SQL Server in one session** — 26 tools across 4 tiers — schema introspection, cross-database compare, query firewall, PII scanning, N+1 detection, and runtime connection management. Read-only data access by design.

**26 tools** · PostgreSQL · MySQL · SQL Server · Read-only data access, schema discovery, profiling, SQL safety, anomaly detection

[![npm version](https://img.shields.io/npm/v/@thinairtelematics/data)](https://www.npmjs.com/package/@thinairtelematics/data)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![smithery badge](https://smithery.ai/badge/thinair/data)](https://smithery.ai/servers/thinair/data)

```console
> describe_schema("fleet")
✓ 42 tables discovered · 6 high-value entities
✓ no write permissions enabled
> ask("Which vehicles had the most idle time last week?")
✓ generated safe read-only SQL · returned 10 rows · flagged 3 exceptions
```

## Part of ThinAir

ThinAir Data is part of the ThinAir platform for fleet visibility, analytics, operational search, reporting, and AI-assisted decision support.

## Hosted product vs this repository

- `data.thinair.co` is the hosted ThinAir product.
- This repository is the thin public MCP package/pointer for developers and AI-agent clients.
- Production use may require a ThinAir account, API key, OAuth connection, or hosted workspace.

## What It Does

ThinAir Data is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that gives AI agents secure, **read-only** access to your databases — no custom backend required. Designed for read-only production access when configured correctly. ThinAir Data enforces read-only behavior through SQL guards, database-session read-only mode where supported, and optional per-connection firewall rules. You should still use least-privilege database credentials and avoid exposing sensitive tables unless required.

- **Multi-database** — PostgreSQL, MySQL, SQL Server in a single session. Cross-database compare with one tool call.
- **Read-only by design** — SQL guards, database-session read-only mode where supported, and optional per-connection firewall rules.
- **Dialect-aware** — every tool understands `SELECT TOP 10` (mssql) vs `LIMIT` (others) and routes syntax correctly per connection.
- **Tiered capability** — 26 tools across 4 tiers: schema introspection, query execution + history, EXPLAIN/optimization, anomaly detection, PII scanning, N+1 detection, query firewall, cross-DB compare, and runtime connection management (add/remove).
- **Connections are managed at runtime** — added per-tenant via the `add_connection` tool after sign-in. Never an env var or install-time config.

## Product Links

- **Product:** https://data.thinair.co
- **Connect a database:** https://data.thinair.co/connect
- **Docs:** https://data.thinair.co/docs/getting-started
- **Pricing:** https://data.thinair.co/checkout
- **ThinAir:** https://thinair.co

## Tools (selected — full list of 26 in [docs](https://data.thinair.co/docs/tools))

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

`add_connection`, `remove_connection`, `optimize_query`, `explain_query`, `suggest_queries`, `generate_migration`, `generate_seed_data`, `watch_table`, `saved_queries`, `impact_analysis`, `configure_allowlist`, and others round out the 26-tool surface.

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

## Not for secrets

Do not commit DSNs, passwords, tokens, private keys, or production credentials. Use OAuth, the hosted connection flow, or your MCP client's secret storage.

## npm Package

[npmjs.com/package/@thinairtelematics/data](https://www.npmjs.com/package/@thinairtelematics/data)

> Previously published as `thinair-data` (now deprecated in favor of the scoped package).

## License

MIT © [ThinAir Telematics](https://thinair.co)
