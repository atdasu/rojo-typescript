# Studio and MCP workflow

Read this before any Roblox Studio or MCP work, including tasks that edit no local
file.

## Before touching Studio

1. Inspect the MCP servers that are actually connected and read their current
   tool descriptions. Do not assume a tool exists because a document names it, and
   do not infer who publishes a server from its display name.
2. Verify the connected place. List the connected Studio sessions and confirm the
   place identity and the intended peer (edit, server or client). A matching name
   is not enough, and the first session in the list is not necessarily the right
   one. An unsaved place with ID 0 has no published destination or owner.
3. Inspect the existing objects, scripts and logs you are about to change.
   Preserve unrelated work, including unsaved Studio changes.

## Who owns what

`default.project.json` is the source of truth; read it before editing.

- **Rojo-owned:** the mapped folders, which hold compiled output and packages.
  Change them by editing the TypeScript in `src/` or `libraries/` and letting
  roblox-ts recompile; never edit `out/` or a synced script in Studio. An edit
  made there is overwritten by the next sync, and Rojo removes children that are
  not on disk.
- **Studio-owned:** everything else, such as `Workspace`, lighting, terrain and
  unmapped folders. Edit these in Studio through MCP. Rojo leaves them alone
  because every service sets `$ignoreUnknownInstances`.

Do not put Studio-authored work inside a mapped folder, and do not broaden a
mapping without first inspecting what it would cover. Treat playtest copies as
temporary: change the edit-mode original.

## Sync

Assume the existing sync session is running. Do not start a second `rojo serve`,
`pnpm dev` or `pnpm watch`, or reconnect the Rojo plugin, because the current
agent cannot see the process. Two servers on one project fight over the same
place. If sync state is uncertain, say so.

Studio only receives a change after roblox-ts has recompiled it. If no watcher is
running, a saved `.ts` file changes nothing in Studio until `pnpm run build`.

A successful file write does not prove Studio received it. When it matters, read
the synced script back through MCP.

## Mutations and retries

Make the smallest edit that does the job. Do not blindly retry a timed-out
mutation or upload: inspect the resulting state or the operation status first,
because a timeout does not mean nothing ran.

Uploading an asset and inserting it into the place are separate operations.
Before an upload, establish the intended creator (user or group) and that it has
permission; never guess it from a username or package name. Never put credentials
in code, logs or chat. Inspect third-party assets, including their scripts, before
inserting them, and do not run untrusted scripts to inspect them.

## Validation

- Test runtime changes in a playtest when Studio is available: solo for local
  behavior, multiplayer for replication and authority. Read both server and
  client logs, and check the changed behavior rather than the absence of errors.
- Stop playtests you started and restore temporary settings. Do not interrupt a
  session that belongs to someone else.
- For configuration-only work, `rojo sourcemap default.project.json` inspects the
  mappings without starting a server.
- Do not publish the place, publish packages or delete assets unless asked.
- Report what changed, what was tested and what remains unverified.
