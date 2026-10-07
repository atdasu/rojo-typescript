# UI

All game UI is built with [Vide](https://centau.github.io/vide/) and previewed in
[UI Labs](https://ui-labs.luau.page/), through the `@rbxts/vide` and
`@rbxts/ui-labs` packages installed with pnpm. `tsconfig.json` points JSX at `Vide.jsx`, so every
`.tsx` file imports `Vide`.

## Components

- A component is a function from props to JSX, in `src/client/UI/<Name>/<Name>.tsx`.
- Components are presentation only. State arrives through props as functions
  (`Message: () => string`) and actions leave through callback props. A component
  never reads game state, fires remotes or plays audio directly.
- Clean up with Vide's `cleanup`; do not leave connections or tasks running after
  a component is destroyed.

## Stories

- Every component has a sibling `<Name>.story.tsx`. It compiles to a ModuleScript
  named `<Name>.story`, which UI Labs discovers by that suffix.
- A story ends with `export = CreateVideStory({ vide: Vide, controls }, render)`
  and passes fixture props only. It never reads live game state.
- When a component changes, mount its story and check interaction, sizes and
  cleanup. A story is not evidence that the wiring in play mode works.

## Shared modules

| Module                           | Use                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/client/UI/ReactiveState.ts` | One store per screen. `createReactiveState(Vide, initial)` returns `state`: `state()` reads a view with one Vide source per field, `state(snapshot)` publishes a full snapshot. |
| `src/client/UI/Sfx.ts`           | Components call `Sfx.play(cue)`. The game calls `Sfx.bind` once with real playback; in stories and tests it stays a silent no-op.                                               |
| `src/client/Lifetime.ts`         | Runs a cleanup exactly once when an instance is destroyed or leaves a root. Call `watch` from a different script than the one being observed.                                   |

`ReactiveState` and `Lifetime` have offline tests in `tests/`.
