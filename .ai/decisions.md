# Decision register

Newest first. Record a decision when it constrains future work and its reason is
not obvious from the code. Do not erase an entry: mark it superseded and link the
entry that replaces it.

```markdown
## YYYY-MM-DD: short title

**Decision:** what was chosen.
**Why:** the constraint or evidence behind it.
**Consequences:** what this rules out or requires.
```

## Template: Rojo owns named folders only

**Decision:** Every service in `default.project.json` sets
`$ignoreUnknownInstances`, and code syncs into named folders (`Shared`, `Server`,
`Client`) rather than onto the services themselves.
**Why:** Maps, lighting and other Studio-authored content must survive a sync.
**Consequences:** A place built with `pnpm place:build` contains code only. Do not
publish that file over a place that holds Studio-authored content.

## Template: tests run offline in Lune against compiled output

**Decision:** Tests are Luau scripts that require files from `out/`.
**Why:** They run in seconds, in CI, without Studio, and exercise the Luau that
actually ships.
**Consequences:** Testable modules have no runtime imports and receive their
dependencies as arguments. Studio behavior still needs a playtest.
