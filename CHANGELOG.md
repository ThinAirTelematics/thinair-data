# Changelog

All notable changes to `@thinairtelematics/data` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
and the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [Unreleased]

## [2.2.0] — 2026-09-14

### Fixed
- **Release pipeline unblocked.** `release.yml` has not run since 2026-05-02
  (v2.1.3 — no `v*` tag pushed since), so this was latent rather than observed on
  that workflow. It would fail on the next tag: `npm install -g npm@latest` now
  resolves to npm 12, whose engines are `^22.22.2 || ^24.15.0 || >=26.0.0`, a hard
  `EBADENGINE` exit 1 on the Node 20 runner. Not hypothetical — the identical step
  in `release-mcp.yml` failed exactly this way on 2026-07-14. Runners now use Node 22 and pin `npm@^11`, with an
  explicit assert that `npm --version` is at least 11.5.1 — the floor for Trusted
  Publisher OIDC auto-auth (OIDC publish landed in 11.5.0; 11.5.1 fixed provenance
  defaulting to OIDC). The assert fails the job rather than publishing unsigned.
- **Version gate unblocked.** `package.json` and `server.json` had drifted apart
  (2.1.3 vs 2.1.4), which the release workflow's own version-match check rejects
  with exit 1. Both now read 2.2.0, matching the version the hosted product
  already serves at `/.well-known/agent-card.json`.

### Changed
- `release-mcp.yml` no longer triggers on pushes to `main`. It previously fired on
  any commit touching `data-mcp/**` *or the workflow file itself*, so an ordinary
  docs commit could start an unreviewed npm publish. It is now
  `workflow_dispatch` only.

### Added
- **Agent-discovery surfaces documented.** The README now points at the live
  `/.well-known/agent-card.json`, `/.well-known/skills.json`, and `/llms.txt`
  endpoints, which agents and directory crawlers can read without parsing prose.
- Generated-content markers (`TOOLCOUNT`, `TOOLS`, `AGENT-DISCOVERY`) in the
  README so a future generator can keep the tool list in sync with the live
  server instead of drifting by hand.

## [2.0.5] — 2026-04-26

### Added
- `repository` field in package.json pointing at https://github.com/ThinAirTelematics/thinair-data — npmjs.com now surfaces a "Repository" link to this public release source.


## [2.0.4] — 2026-04-26

### Changed
- Release pipeline moved to a dedicated public repository
  (https://github.com/ThinAirTelematics/thinair-data) — enables npm provenance
  attestation without exposing the source monorepo. First version published
  with `--provenance` from CI.

## [2.0.3] — 2026-04-26

### Removed
- Dropped `repository` and `bugs.url` fields that pointed to the source repo.
  Issues and source links route through https://data.thinair.co/support and
  support@thinair.co instead.

## [2.0.2] — 2026-04-26

### Added
- `mcpName: "co.thinair/data"` in `package.json` for MCP Registry ownership verification.

### Changed
- MCP Registry namespace updated to slash-separated format (`co.thinair/data`).

## [2.0.1] — 2026-04-26

### Added
- Initial `mcpName` field for the MCP Registry (later corrected in 2.0.2).

## [2.0.0] — 2026-04-26

### Changed
- **Renamed package** from `thinair-data` (unscoped) to `@thinairtelematics/data` (scoped).
- Bin parity with `@thinairtelematics/geo`: `--api-key`, `--transport sse` flags;
  keyless OAuth 2.1 default with optional key-bearing variant.
- README, badges, and footer URLs updated for the new package name.

### Migration
The unscoped `thinair-data@1.0.x` has been deprecated; npm surfaces a
deprecation message pointing users to `@thinairtelematics/data`. The printed
config block is identical, so no consumer-side changes are needed.

## [1.0.1] — 2026-04-25

### Added
- `LICENSE` file (MIT) shipped in tarball.
- README links section: `Main: https://data.thinair.co` as the first entry.

### Fixed
- Removed Discord/Enterprise lines from README links.
- Updated docs URL to `https://data.thinair.co/docs/getting-started`.

## [1.0.0] — 2026-04-25

### Added
- Initial public release.
- `npx thinair-data` prints a ready-to-paste MCP client config block for the
  hosted `https://data.thinair.co/mcp` endpoint.
- Flags: `--api-key <key>`, `--transport sse`.
- Keyless OAuth 2.1 default; key-bearing variant for non-OAuth clients.
- Zero runtime dependencies.

