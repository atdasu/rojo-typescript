# Agent instructions

This file is the shared startup contract for coding agents. Keep it under 150 lines.
Do not append task history, test receipts or superseded rules here; route to a
document instead. `CLAUDE.md` imports only this file.

## Load only what the task needs

Before changing a subsystem, read its row. Do not bulk-read `.ai/` at startup.

| Task                                        | Read before changes                                      |
| ------------------------------------------- | -------------------------------------------------------- |
| Where code goes, new modules or services    | `.ai/specs/architecture.md`                              |
| UI components, stories, UI state            | `.ai/specs/ui.md`                                        |
| Writing or running tests                    | `.ai/guides/testing.md`                                  |
| Any Studio or MCP work, upload or import    | `.ai/guides/studio.md`, even if no local file is touched |
| pnpm or Wally packages, internal libraries  | `docs/dependency-management.md`                          |
| Why something is the way it is              | Search `.ai/decisions.md`                                |
| Anything else, or where to record new facts | `.ai/README.md`                                          |

## Project rules

- Game code is TypeScript compiled to Luau by roblox-ts. Tooling is pnpm, Rojo,
  Wally and Rokit-pinned tools. Use pnpm, never npm or yarn. Run commands from
  the repository root.
- Edit `src/` and `libraries/*/src` only. `out/`, `include/`,
  `src/shared/InternalLibraries/`, `Packages/` and `ServerPackages/` are generated:
  never edit them, and never edit synced scripts in Studio.
- `default.project.json` defines sync ownership. Rojo owns the named folders it
  maps and leaves everything else in the place to Studio.
- Entry scripts end in `.server.ts` or `.client.ts` (`.tsx` with JSX); everything
  else is a module. The compiler runs in strict mode.
- Services take their dependencies as arguments and pure logic lives in
  `src/shared`, so both can be tested offline. See `.ai/specs/architecture.md`.
- Runtime pnpm dependencies must be roblox-ts compatible (`@rbxts/*`); ordinary Node or
  browser packages do not run in Roblox. Tooling goes in `devDependencies`.
- Do not update tools or dependencies incidentally, and never edit lockfiles by
  hand. `typescript` is pinned to the version roblox-ts requires.
- Server code owns authoritative state and validates every client request.
  Secrets and server-only packages stay out of `ReplicatedStorage`.

## Verification

- Inspect `git status` and the relevant files before editing; preserve unrelated
  changes. Do not commit, push or publish unless asked.
- Run `pnpm check` after code changes. It checks formatting, lints, checks the
  dependency policy, compiles and runs the offline tests. Documentation-only
  changes need only `pnpm format:check`.
- Offline tests are not evidence of Studio rendering, input, replication or
  persistence. Say which of those were and were not verified.
- Assume a sync session may already be running: do not start `pnpm dev`,
  `pnpm watch` or `rojo serve` unless asked.

## Keeping context small

- New evidence goes in a dated file under `.ai/audits/`, substantial choices in
  `.ai/decisions.md`, lasting contracts in `.ai/specs/`, procedures in
  `.ai/guides/`. Add a routing row above when a new document should be found.
- `.claude/rules/*.md` are short path-scoped reminders. Keep their `paths`
  frontmatter; an unscoped rule loads on every start.
