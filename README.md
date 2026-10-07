# StarterGame

[![CI](https://github.com/atdasu/rojo-typescript/actions/workflows/ci.yml/badge.svg)](https://github.com/atdasu/rojo-typescript/actions/workflows/ci.yml)

A Roblox game template built with roblox-ts, pnpm, Rojo, Rokit, Wally and Lune.

It ships with strict compilation, linting, formatting, offline tests, a small Vide
UI kit, agent instructions and GitHub Actions. For the plain Luau version see
[atdasu/rojo](https://github.com/atdasu/rojo).

## Use this template

1. Click **Use this template** on GitHub and create your repository.
2. Put your own name in `LICENSE` and replace `CONTRIBUTING.md`. Rename `StarterGame` in `default.project.json`, `package.json` (`place:build`)
   and `src/shared/constants.ts`, `starter-game` in `package.json`, and
   `starter/starter-game` in `wally.toml`. Update the title and badge above. To
   rename the `@starter` library scope, see
   [Dependency management](docs/dependency-management.md).
3. Follow [After creating a repository](docs/repository-setup.md) to turn on branch
   protection and the security features, which a template does not copy.

## Prerequisites

- Node.js 24 with Corepack enabled (`corepack enable` provides the pnpm version
  recorded in `package.json`)
- [Rokit](https://github.com/rojo-rbx/rokit)
- Roblox Studio with the Rojo plugin installed

## First-time setup

```powershell
rokit install
pnpm install
pnpm wally:install
```

`rokit install` installs the project-pinned tools: Rojo, Wally and Lune.
`pnpm wally:install` materializes the dependencies in `wally.toml` into the ignored
`Packages` and `ServerPackages` directories; with no Wally dependencies it creates
nothing, and Rojo treats both paths as optional.

## Development

```powershell
pnpm dev
```

The command compiles the project once, then runs `rbxtsc --watch`, the internal
library watcher and `rojo serve default.project.json` together. In Roblox Studio,
open the Rojo plugin, connect to the running server, and changes sync after rbxtsc
recompiles them.

## Common commands

| Command              | Purpose                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `pnpm dev`           | Compile, then watch and serve the project to Studio.              |
| `pnpm check`         | Check formatting, lint, check dependencies, compile and run tests |
| `pnpm test`          | Compile and run the offline tests in `tests/`.                    |
| `pnpm format`        | Format project files with Prettier.                               |
| `pnpm wally:install` | Install dependencies from `wally.toml`.                           |
| `pnpm place:build`   | Compile and build `build/StarterGame.rbxl`.                       |

## Project layout

| Source           | Roblox location                              |
| ---------------- | -------------------------------------------- |
| `src/shared`     | `ReplicatedStorage.Shared`                   |
| `src/server`     | `ServerScriptService.Server`                 |
| `src/client`     | `StarterPlayer.StarterPlayerScripts.Client`  |
| `libraries/*`    | `ReplicatedStorage.Shared.InternalLibraries` |
| `node_modules`   | `ReplicatedStorage.rbxts_include`            |
| `Packages`       | `ReplicatedStorage.Packages`                 |
| `ServerPackages` | `ServerStorage.ServerPackages`               |

`libraries/*` are internal roblox-ts workspace packages, and `rbxts_include` exposes
the roblox-ts runtime and `@rbxts` packages to client and server code.

Rojo owns only those named folders. Every service in `default.project.json` sets
`$ignoreUnknownInstances`, so maps, lighting and anything else you build in Studio
next to the synced code is left alone. Inside a mapped folder Rojo removes whatever
is not on disk, so keep Studio-authored work out of them.

Because of that, a place built with `pnpm place:build` contains code only. Do not
publish it over a place that holds Studio-authored content.

See [Dependency management](docs/dependency-management.md) for the Wally, npm and
internal-library workflows.

## Offline tests

`tests/*.luau` are Lune scripts. They require the compiled modules from `../out`
and run them with hand-made fakes, with no Studio needed:

```powershell
pnpm test                 # compile, then run every test
lune run test lifetime    # tests/lifetime.luau only, against the current out/
```

Tests are Luau because they exercise the compiler output, which is what ships.
This works because of two conventions:

- **Services take their dependencies as arguments**, for example
  `new RoundService({ Players, Workspace })`, instead of calling `game.GetService`
  themselves. A test passes plain tables in their place.
- **Pure logic lives in `src/shared`**, for example `src/shared/Math`, and never
  touches `game`, `script` or `Workspace`.

A module can be required offline only when its compiled file is self-contained: use
`import type` for types and pass collaborators in, because a value import compiles
to a `TS.import` call that needs Roblox. Offline tests prove logic only; rendering,
input, replication and persistence still need a playtest. More in
[.ai/guides/testing.md](.ai/guides/testing.md).

## UI kit

UI is built with [Vide](https://centau.github.io/vide/) and previewed with
[UI Labs](https://ui-labs.luau.page/), through `@rbxts/vide` and `@rbxts/ui-labs`.

- Components live in `src/client/UI/<Name>/<Name>.tsx` and take all state through
  props.
- Each component has a sibling `<Name>.story.tsx`. Install the UI Labs plugin in
  Studio and it lists every story in the place.
- `UI/ReactiveState.ts` is a per-field reactive store, `UI/Sfx.ts` decouples
  components from audio playback, and `Lifetime.ts` runs a cleanup exactly once when
  an instance goes away.

Not building UI with Vide? Delete `src/client/UI`, `src/client/Lifetime.ts`, their
two tests and the UI part of `src/client/main.client.tsx`, then run
`pnpm remove @rbxts/vide @rbxts/ui-labs`.

## Working with coding agents

`AGENTS.md` is a short routing table that tells an agent which document to read for
which task; `CLAUDE.md` only imports it. `.claude/rules/` holds path-scoped
reminders, and `.ai/` holds the specs, guides, decisions and audits those routes
point to. Fill them in as the game takes shape and keep `AGENTS.md` short.

## Continuous integration

- **CI** (`.github/workflows/ci.yml`) runs `pnpm check` and `pnpm place:build` on
  every push to `main` and every pull request, and uploads the built place.
- **Release** (`.github/workflows/release.yml`) runs when you push a tag such as
  `v1.0.0`. It checks, builds, and attaches the place file to a GitHub release.
- **Dependabot** keeps npm packages and the GitHub Actions up to date. It leaves
  `typescript` alone, because roblox-ts requires one exact version, and it cannot
  read `rokit.toml` or `wally.toml`; update those by hand.

## License

[MIT](LICENSE). This template does not accept contributions; see
[CONTRIBUTING.md](CONTRIBUTING.md). Fork it freely.
