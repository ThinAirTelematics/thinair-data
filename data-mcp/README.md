# @thinairtelematics/data-mcp

> Connect your AI to any database — PostgreSQL, MySQL, or SQL Server — in 60 seconds.

[![npm](https://img.shields.io/npm/v/@thinairtelematics/data-mcp)](https://www.npmjs.com/package/@thinairtelematics/data-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

ThinAir Data MCP is a **hosted** [Model Context Protocol](https://modelcontextprotocol.io) server that gives AI assistants (Claude Desktop, Cursor, Copilot, Cline, Continue, Perplexity, Zed, and any MCP-compatible client) direct, read-only access to your databases — with 23 dialect-aware tools across 4 tiers.

No local server to run. No Docker. No ports. This npm package is a tiny config printer; the actual MCP server runs on Cloudflare at `data.thinair.co/mcp`.

---

## Quickstart

```bash
npx @thinairtelematics/data-mcp
```

Prints a keyless MCP config — paste into your client's `mcp.json` and restart. On the first tool call your client opens a browser tab at `/authorize`, you paste a connection string, and the bearer token is cached locally. **No manual API key to manage.**

### Getting a persistent key

For CI, scripts, or non-OAuth clients, you need an explicit `ta_data_*` key. Once your MCP client is connected, ask it:

> *"Call the `issue_api_key` tool."*

That's the only way to mint a persistent key — there is no web signup page. The tool is rate-limited to 5 issuances per tenant per day. Paste the returned key into `--api-key`:

```bash
npx @thinairtelematics/data-mcp --api-key ta_data_...
```

Paid plans: https://data.thinair.co/checkout (Stripe checkout; webhook flips your key's plan in-place, no config change).

**Help:**

```bash
npx @thinairtelematics/data-mcp --help
```

---

## Config shapes

**Keyless (OAuth 2.1 — recommended):**

```json
{
  "mcpServers": {
    "thinair-data": {
      "type": "url",
      "url": "https://data.thinair.co/mcp"
    }
  }
}
```

**With API key:**

```json
{
  "mcpServers": {
    "thinair-data": {
      "type": "url",
      "url": "https://data.thinair.co/mcp",
      "headers": { "x-api-key": "ta_data_..." }
    }
  }
}
```

Keys come from the MCP server itself — connect any client keyless (above), then ask it to call `issue_api_key`. See the Quickstart section.

---

## Tools

### Discover tier (free — 25 queries/day)

| Tool | Description |
|------|-------------|
| `query_sql` | Execute read-only SELECT / WITH / EXPLAIN — dialect-aware |
| `describe_schema` | Full schema: tables, columns, types, PKs, FKs, indexes. Cached 1h |
| `analyze_table` | Row count, null rates, cardinality, min/max/avg, date ranges |
| `detect_anomalies` | Volume drops/spikes, data gaps, high nulls, stale data — severity ranked |
| `suggest_queries` | Schema-aware SQL suggestions based on a topic or goal |
| `test_connection` | Ping + server version + latency |
| `list_connections` | All registered connections for your tenant |
| `quota` | Current usage, daily limit, plan |

### Build tier ($9/mo — 200 queries/day)

| Tool | Description |
|------|-------------|
| `explain_query` | EXPLAIN ANALYZE → plain-English recommendations |
| `optimize_query` | Rewritten SQL + index DDL suggestions |
| `data_profile` | Health score 0–100, PII detection, insight warnings |
| `query_history` | Recent queries with timing, row counts, status |
| `saved_queries` | Save, run, list, delete named queries |
| `generate_migration` | Dialect-correct ALTER TABLE + rollback from plain-English intent |
| `generate_seed_data` | Realistic INSERT statements for dev/test, FK-aware |
| `show_locks` | Active sessions + blocking locks |
| `pii_scan` | Sweep string columns for email, SSN, credit card, phone, JWT, bearer tokens |

### Architect tier ($29/mo — unlimited)

| Tool | Description |
|------|-------------|
| `watch_table` | Monitor row count + latest record vs previous snapshot |
| `find_n_plus_one` | Detect N+1 query patterns from query history |
| `query_firewall` | SQL rules: block patterns, require WHERE, log PII access |
| `impact_analysis` | Blast radius of a schema change — FK deps, affected views, risk score |
| `cross_db_query` | Same query across 2–4 connections in parallel for diff/drift |

---

## Pricing

| Plan | Price | Daily queries | Connections |
|------|-------|---------------|-------------|
| Discover | Free | 25 | unlimited |
| Build | $9/mo | 200 | unlimited |
| Architect | $29/mo | unlimited | unlimited |
| Enterprise | Custom | unlimited | Private deploy · SSO |

Trial keys expire after 14 days. Paid plans never expire — upgrading clears expiry on your existing key, **no config change needed** (webhook flips plan in place).

---

## Security

- **Read-only at 3 layers** — static SQL firewall + session-level `SET TRANSACTION READ ONLY` + optional rule-based query firewall
- **AES-256-GCM** encryption for connection strings at rest
- **Query history encrypted** at rest with 7-day TTL (and a tenant opt-out)
- **Zero data persistence** — query results stream to your AI client; ThinAir keeps only anonymized timing metadata
- **Stripe webhook HMAC verify**, `/success` idempotency, Turnstile on every public form

---

## Supported databases

- **PostgreSQL** — Neon, Supabase, RDS/Aurora, Azure Flexible, Timescale
- **MySQL / MariaDB** — RDS, Azure Flexible (`?ssl=true`)
- **SQL Server** — Azure SQL (`?encrypt=strict`), Synapse, on-prem TDS 8

---

## Links

- Landing → https://data.thinair.co
- Docs → https://data.thinair.co/docs/getting-started
- Pricing → https://data.thinair.co/checkout
- Contact → https://www.thinair.co/contact-us/
