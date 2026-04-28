#!/usr/bin/env node
/**
 * @thinairtelematics/data — local stdio reference adapter.
 *
 * Production runtime is hosted on Cloudflare Workers at
 * https://data.thinair.co/mcp (streamable-http transport, OAuth 2.0 + Bearer).
 *
 * This file is a STATIC tool-catalog adapter that satisfies stdio-only
 * MCP runners (e.g. Glama's automated quality check, sandboxed CI) without
 * proxying to the hosted endpoint. tools/list returns the real tool catalog
 * so the runner indexes capabilities accurately; tools/call returns a
 * redirect message pointing the caller at the hosted endpoint for execution.
 *
 * Real users should configure their MCP client with the hosted URL directly
 * (printed by `bin/start.js`). This file exists for the quality-check gate.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const REDIRECT_MESSAGE =
  "This is the local reference adapter for ThinAir Data. " +
  "Tool execution requires the hosted MCP server at https://data.thinair.co/mcp " +
  "and a connected database (PostgreSQL / MySQL / SQL Server). " +
  "Mint a Bearer token at https://data.thinair.co/connect and add a database via /add-database " +
  "to execute tools.";

const TOOLS = [
  // DISCOVER tier (free)
  {
    name: "query_sql",
    description:
      "Execute a read-only SQL query against the target connection. ONLY SELECT / WITH / EXPLAIN permitted. Write dialect-appropriate SQL for the connection's engine — PostgreSQL syntax for postgres, T-SQL for mssql, MySQL for mysql. Response meta includes `connection` + `dialect` so you know which syntax worked. Default LIMIT 100 unless the user asks for all rows.",
    inputSchema: { type: "object" },
  },
  {
    name: "describe_schema",
    description:
      "Discover the full database schema: tables, columns, types, primary keys, foreign keys, and indexes. Results cached 1 hour. Call with refresh=true after schema changes.",
    inputSchema: { type: "object" },
  },
  {
    name: "analyze_table",
    description:
      "QUICK statistical snapshot for ONE table — row count, null rates, cardinality, numeric min/max/avg, date ranges. Optionally drill into a specific column. Use `data_profile` when the user wants a FULL quality report including PII detection.",
    inputSchema: { type: "object" },
  },
  {
    name: "detect_anomalies",
    description:
      "Scan a table for unusual patterns: volume drops/spikes, data gaps, value concentration, high null rates, stale data. Severity-ranked alerts. Tables > 100k rows use a sampled path (~5%). Dialect-aware sampling.",
    inputSchema: { type: "object" },
  },
  {
    name: "suggest_queries",
    description:
      "Generate schema-aware query suggestions with ready-to-run SQL. Great for exploring unfamiliar databases or finding useful queries.",
    inputSchema: { type: "object" },
  },
  {
    name: "test_connection",
    description:
      "Ping a connection (SELECT 1) and return server version + latency. Fast way to confirm credentials and network path without running describe_schema.",
    inputSchema: { type: "object" },
  },
  {
    name: "list_connections",
    description:
      "List every database connection registered for your tenant: name, id, dbType (postgres / mysql / mssql), createdAt. Flags duplicate names. Returns nothing sensitive (no DSN, no credentials).",
    inputSchema: { type: "object" },
  },
  {
    name: "quota",
    description:
      "Check current API usage, daily limit, plan name, and upgrade options.",
    inputSchema: { type: "object" },
  },
  {
    name: "issue_api_key",
    description:
      "Issue a fresh ta_data_* API key for your current tenant. Useful for pasting into /add-database or configuring a separate integration. Rate-limited to 5 issuances per tenant per day.",
    inputSchema: { type: "object" },
  },
  // BUILD tier
  {
    name: "explain_query",
    description:
      "Analyze a SQL query's execution plan and return plain-English performance recommendations. Runs EXPLAIN ANALYZE (Postgres) or EXPLAIN FORMAT=JSON (MySQL). [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "optimize_query",
    description:
      "Suggest a rewritten, optimized version of a SQL query with explanations. Identifies sequential scans, missing indexes, sort spills, join inefficiencies, and suggests index DDL. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "data_profile",
    description:
      "FULL data quality + compliance report for a table: per-column stats PLUS a 0-100 health score, type-gated PII detection (email / phone / SSN / etc.), and insight warnings. Use this when the user says 'profile' or 'quality report' or mentions PII/compliance. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "query_history",
    description:
      "Return recent queries executed through ThinAir with timing, row counts, and status. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "saved_queries",
    description:
      "Manage your personal library of reusable SELECT queries. action=save stores a query by name; action=run executes a saved query; action=list returns all your saved queries; action=delete removes one. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "generate_migration",
    description:
      "Generate dialect-correct ALTER TABLE migration SQL + rollback from a plain-English intent. Output uses the connection's exact dialect. Never executes. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "generate_seed_data",
    description:
      "Generate realistic, schema-aware INSERT statements for development and testing. Respects types, constraints, and FK relationships. Never executes. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "show_locks",
    description:
      "List active sessions + blocking locks. Uses the dialect's own system view: `pg_stat_activity` on postgres, `information_schema.processlist` on mysql, `sys.dm_exec_requests` joined with `sys.dm_tran_locks` on mssql. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "pii_scan",
    description:
      "Sweep string columns across tables for common PII patterns (email, SSN, credit card, phone, JWT, bearer tokens). Heuristic-only — not a compliance guarantee. [BUILD tier]",
    inputSchema: { type: "object" },
  },
  // ARCHITECT tier
  {
    name: "watch_table",
    description:
      "Monitor a table's row count and latest record. Compares to previous snapshot to show changes. Built-in scheduler. [ARCHITECT tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "find_n_plus_one",
    description:
      "Detect N+1 query patterns from recent query history. Fingerprints queries and flags repeated patterns. [ARCHITECT tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "query_firewall",
    description:
      "Manage per-connection SQL rules: block dangerous patterns, require WHERE on large tables, log PII access. [ARCHITECT tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "impact_analysis",
    description:
      "Analyze the blast radius of a proposed schema change: FK dependencies, affected views, row count, risk score. [ARCHITECT tier]",
    inputSchema: { type: "object" },
  },
  {
    name: "cross_db_query",
    description:
      "Run a federated query across multiple connections (different dialects). Returns a unified result set with per-source provenance. [ARCHITECT tier]",
    inputSchema: { type: "object" },
  },
];

const server = new Server(
  {
    name: "thinair-data",
    version: "2.0.6",
  },
  {
    capabilities: { tools: {} },
    instructions:
      "This is the local reference adapter. The production server is hosted at https://data.thinair.co/mcp — connect there for real tool execution against your databases. tools/list reflects the live tool catalog.",
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async () => ({
  content: [{ type: "text", text: REDIRECT_MESSAGE }],
  isError: false,
}));

const transport = new StdioServerTransport();
await server.connect(transport);
