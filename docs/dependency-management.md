# Dependency management

This project has three dependency lanes. Keep a dependency in exactly one lane so
its installation, runtime location, and ownership are unambiguous.

| Lane               | Use it for                                         | Source of truth                                        | Roblox runtime location                                                                                 |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Wally              | Luau/Roblox packages                               | `wally.toml` and `wally.lock`                          | `ReplicatedStorage.Packages` or `ServerStorage.ServerPackages`                                          |
| npm                | Tooling and reviewed roblox-ts-compatible packages | `package.json` and `pnpm-lock.yaml`                    | `ReplicatedStorage.rbxts_include.node_modules` when the package provides Roblox-compatible runtime code |
| Internal libraries | Reusable game TypeScript owned by this repository  | `libraries/*/package.json` and the root `package.json` | `ReplicatedStorage.Shared.InternalLibraries`                                                            |

Do not use ordinary Node.js or browser packages at Roblox runtime. They often rely
on Node, the DOM, or JavaScript features that do not exist in Luau. Tooling belongs
in `devDependencies`; runtime npm code must be reviewed as roblox-ts-compatible.

## Initial setup

Run this once after cloning and again after dependency-manifest changes:

```powershell
rokit install
pnpm install
pnpm wally:install
```

`pnpm install` links every internal workspace library. `pnpm wally:install`
materializes Wally packages into the generated `Packages` and `ServerPackages`
directories. Do not edit either generated directory by hand.

Command-line tools (Rojo, Wally, Lune) are pinned in `rokit.toml`. Dependabot
updates npm packages and GitHub Actions but cannot read `rokit.toml` or
`wally.toml`, so update those by hand. It also leaves `typescript` alone: roblox-ts
requires one exact version, so change the two together.

## Wally dependencies

Add shared packages under `[dependencies]` in `wally.toml`. Add packages that must
never replicate to clients under `[server-dependencies]`.

```toml
[dependencies]
# example = "publisher/package@1.2.3"

[server-dependencies]
# server-example = "publisher/server-package@1.2.3"
```

Then install them:

```powershell
pnpm wally:install
```

Shared Wally dependencies are available at `ReplicatedStorage.Packages` and may be
required from shared, client, or server code. Server Wally dependencies are placed
in `ServerStorage.ServerPackages` and may only be required by server code. Follow
the dependency's documentation for its exact module folder and API; some Wally
packages also offer a typed `@rbxts/*` npm companion.

Commit both `wally.toml` and `wally.lock`. Never commit generated package contents.

## npm dependencies

Use `devDependencies` for tools, types, build helpers, and any package that does
not execute in Roblox:

```powershell
pnpm add -D <package-name>
```

Use `dependencies` only for a reviewed Roblox-compatible scoped package, normally
an `@rbxts/*` package:

```powershell
pnpm add @rbxts/<package-name>
```

`pnpm run deps:check` blocks runtime packages outside the scopes listed in
`package.json` under `roblox.runtimeNpmScopes`. To approve a new external scope,
first verify that it is roblox-ts/Luau-compatible, then add the scope in all three
places:

1. `roblox.runtimeNpmScopes` in `package.json`.
2. `compilerOptions.typeRoots` in `tsconfig.json` as `node_modules/@scope`.
3. `ReplicatedStorage.rbxts_include.node_modules` in `default.project.json` as an
   `"@scope"` child whose `$path` is `node_modules/@scope`.

The three edits ensure the compiler accepts the package and Rojo makes its runtime
files available. Commit `package.json` and `pnpm-lock.yaml` together.

## Internal libraries

Internal libraries are pnpm workspace packages in `libraries/*`. They use the
`@starter` scope and are compiled with the game, so their TypeScript becomes Luau
under `ReplicatedStorage.Shared.InternalLibraries`. The build synchronizes their public
source into the ignored `src/shared/InternalLibraries` build input; never edit that
generated directory. Import only a library's public root entry point.

The included `@starter/core` package is the reference implementation:

```ts
import { createGreeting } from "@starter/core";
```

### Add an internal library

For a new library named `inventory`, create this structure:

```text
libraries/inventory/
  package.json
  src/index.ts
```

Set its manifest name to the required scope plus its folder name:

```json
{
  "name": "@starter/inventory",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "files": ["src"]
}
```

Export the supported API from `libraries/inventory/src/index.ts`, then link it to
the game as a runtime workspace dependency:

```powershell
pnpm add @starter/inventory@workspace:*
```

Use it from game code with:

```ts
import { Inventory } from "@starter/inventory";
```

Run `pnpm run check` afterward. The dependency check requires every folder name
and package name to agree, preventing accidental duplicate or incorrectly scoped
internal libraries.

### Rename the internal package scope

If `@starter` is not the desired project scope, choose a lowercase npm scope such
as `@my-game`. Update it consistently in:

1. `roblox.internalLibraryScope` and `roblox.runtimeNpmScopes` in `package.json`.
2. The `@starter/*` entry in `tsconfig.json`.
3. Every `libraries/*/package.json` name and each root workspace dependency.
4. All imports from `@starter/...`.

Then run `pnpm install` and `pnpm run check`.

## Verification and routine commands

| Command                | What it checks or produces                                     |
| ---------------------- | -------------------------------------------------------------- |
| `pnpm run deps:check`  | Runtime npm scopes and internal library package names          |
| `pnpm run build`       | Compiles game and internal-library TypeScript to Luau          |
| `pnpm run check`       | Formatting, linting, dependency policy, compilation, and tests |
| `pnpm test`            | Compiles, then runs the offline Lune tests in `tests/`         |
| `pnpm wally:install`   | Installs Wally dependencies into generated package directories |
| `pnpm run place:build` | Builds `build/StarterGame.rbxl` through Rojo                   |

Before opening a pull request, run `pnpm run check`, `pnpm wally:install` if the
Wally manifest changed, and `pnpm run place:build` for an end-to-end Rojo check.
