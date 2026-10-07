---
paths:
  - "tests/**/*.luau"
---

Read .ai/guides/testing.md first. Tests are Luau run offline in Lune against the
compiled files in `out/`: require by relative path, pass hand-made fakes, assert,
and print one PASS line. A module with a runtime import cannot be required
offline; pass the dependency in as an argument instead. Run with `pnpm test`.
