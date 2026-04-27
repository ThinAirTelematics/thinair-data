# Changelog

All notable changes to `@thinairtelematics/data` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
and the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [Unreleased]

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

