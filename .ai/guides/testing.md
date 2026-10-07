# Offline tests

Tests are Lune scripts in `tests/*.luau`. They require the compiled Luau in
`../out` and run without Roblox Studio.

```powershell
pnpm test                 # compile, then run every test
lune run test lifetime    # tests/lifetime.luau only, against the current out/
```

Each file runs in its own process. A test passes when it exits normally and fails
when it throws, so use `assert(condition, "what should be true")`.

Tests are written in Luau because they exercise exactly what ships: the compiler
output. `lune run test` does not compile, so run `pnpm run build` (or `pnpm test`)
after changing TypeScript.

## Writing a test

1. Require the compiled module and pick its export:
   `require("../out/client/Lifetime").Lifetime`.
2. Build hand-made fakes for whatever the module receives. A fake is a plain table
   with only the members the module uses. See `tests/lifetime.luau` for a fake
   signal and `tests/reactive-state.luau` for a fake Vide.
3. Assert on results and on the fakes.
4. End with one `print("PASS: <name>")` line.

## What can be tested offline

A module is testable when its compiled file is self-contained:

- **No runtime imports.** `import type` is erased, but a value import compiles to
  `TS.import(...)`, which needs the Roblox DataModel. Receive collaborators as
  arguments instead; that is why services take their dependencies as arguments.
- **No runtime-library features** at module level: async functions, generators
  and some spread forms pull in `RuntimeLib`. Open the file in `out/` and check
  that it has no `TS.` reference.
- **No `game`, `script` or `Workspace`** access while being required.

If a module is hard to test, move its logic into a pure function in `src/shared`
and keep the Roblox calls in a thin caller. Roblox instance methods compile to `:`
calls, so fakes declare them with a `self` parameter.

`@lune/roblox` can build real datatypes (`Vector3`, `CFrame`) when a test needs
them.

## Limits

Offline tests prove logic only. They do not exercise rendering, input,
replication, physics or DataStores. Verify those in a Studio playtest and report
them separately.
