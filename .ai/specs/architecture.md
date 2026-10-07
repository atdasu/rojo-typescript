# Architecture

## Where code lives

| Source           | Compiled to      | Roblox location                                   | Runs on           |
| ---------------- | ---------------- | ------------------------------------------------- | ----------------- |
| `src/shared`     | `out/shared`     | `ReplicatedStorage.Shared`                        | Server and client |
| `src/server`     | `out/server`     | `ServerScriptService.Server`                      | Server            |
| `src/client`     | `out/client`     | `StarterPlayer.StarterPlayerScripts.Client`       | Client            |
| `libraries/*`    | `out/shared/...` | `ReplicatedStorage.Shared.InternalLibraries`      | Server and client |
| `node_modules`   | not compiled     | `ReplicatedStorage.rbxts_include`                 | Server and client |
| `Packages`       | not compiled     | `ReplicatedStorage.Packages` (Wally, generated)   | Server and client |
| `ServerPackages` | not compiled     | `ServerStorage.ServerPackages` (Wally, generated) | Server            |

Each mapping is a named folder inside its service, and every service sets
`$ignoreUnknownInstances`. Rojo therefore owns only those folders: anything a
person builds in Studio beside them is preserved. Inside a mapped folder Rojo
removes whatever is not on disk, so never put Studio-authored work there.

roblox-ts reads `default.project.json` to resolve imports. After changing a
mapping, rebuild and check that the compiled `TS.import` paths still resolve.

## Module conventions

- **Entry scripts are thin.** `main.server.ts` and `main.client.tsx` fetch Roblox
  services, construct modules and connect them. They hold no logic.
- **Services take their dependencies as arguments.** A service is a class or
  factory that receives everything it touches:

  ```ts
  const rounds = new RoundService({ Players, Workspace });
  ```

  It never calls `game.GetService` itself, so a test can pass hand-made fakes.

- **Pure logic lives in `src/shared`**, for example `src/shared/Math`. Pure modules
  take values and return values. They do not touch `game`, `script` or `Workspace`.
- **Offline-testable modules have no runtime imports.** Use `import type` for
  types and receive collaborators as arguments. A module with a value import
  compiles to a `TS.import` call that only resolves inside Roblox. See
  `.ai/guides/testing.md`.
- Export plain functions, or objects whose members are arrow functions. Method
  shorthand compiles to a `:` call, which is awkward to use from Luau tests.
- Import only the public root of an internal library or package.

## Authority

The server owns simulation results, inventory, currency, purchases and saved data,
and validates every request a client sends. Clients own input and presentation.
Nothing secret or server-only is placed under `ReplicatedStorage`.
