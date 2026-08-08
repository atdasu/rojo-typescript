# StarterGame

A private Roblox game starter built with pnpm, roblox-ts, Rojo, Rokit, and Wally.

## Prerequisites

- Node.js 18 or newer with Corepack enabled
- pnpm (the required version is recorded in `package.json`)
- [Rokit](https://github.com/rojo-rbx/rokit)
- Roblox Studio with the Rojo plugin installed

## First-time setup

```powershell
rokit install
pnpm install
pnpm wally:install
```

`rokit install` installs the project-pinned tools: Rojo 7.0.0 and Wally 0.3.2.
`wally:install` materializes dependencies defined in `wally.toml` into `Packages` and
`ServerPackages`, then restores their tracked placeholders when the manifest has no dependencies.

## Development

```powershell
pnpm dev
```

The command first compiles the project, then starts `rbxtsc --watch` and
`rojo serve default.project.json` together. In Roblox Studio, open the Rojo plugin,
connect to the running server, and changes will sync after rbxtsc recompiles them.

## Common commands

| Command              | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `pnpm check`         | Check formatting, lint the TypeScript source, and compile. |
| `pnpm format`        | Format project files with Prettier.                        |
| `pnpm wally:install` | Install dependencies from `wally.toml`.                    |
| `pnpm place:build`   | Compile and build `build/StarterGame.rbxl`.                |

## Project layout

- `src/client` compiles into `StarterPlayerScripts`.
- `src/server` compiles into `ServerScriptService`.
- `src/shared` compiles into `ReplicatedStorage`.
- `rbxts_include` in `ReplicatedStorage` exposes the roblox-ts runtime to both client and server code.
- `Packages` maps to `ReplicatedStorage.Packages` for shared Wally dependencies.
- `ServerPackages` maps to `ServerStorage.ServerPackages` for server-only Wally dependencies.

Rename `StarterGame` in `default.project.json`, `starter-game` in `package.json`, and
`starter/starter-game` in `wally.toml` when the project receives its real identity.
