# Agent context index

Start with the root `AGENTS.md` and follow one route. Nothing here is loaded
automatically; open only what the current task needs.

| Folder         | Holds                                                    | Rule                                                        |
| -------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| `specs/`       | Lasting contracts: what the game and its code must do    | Edit in place when the contract changes                     |
| `guides/`      | Procedures: how to do a kind of work safely              | Edit in place when the procedure changes                    |
| `decisions.md` | Substantial choices and why they were made               | Append; newest first; mark superseded entries, do not erase |
| `audits/`      | Dated evidence: test receipts, measurements, screenshots | One file per audit, `YYYY-MM-DD-topic.md`; never rewritten  |

## Current documents

| Work                               | Read                                             |
| ---------------------------------- | ------------------------------------------------ |
| Code layout and module conventions | [Architecture](specs/architecture.md)            |
| UI components and stories          | [UI](specs/ui.md)                                |
| Offline tests                      | [Testing](guides/testing.md)                     |
| Studio, MCP, uploads, sync         | [Studio workflow](guides/studio.md)              |
| Dependencies and tools             | [Dependencies](../docs/dependency-management.md) |
| Past choices                       | [Decisions](decisions.md)                        |

When a document is added, add its row here and, if agents should find it from a
cold start, in `AGENTS.md`.

Audits record what was true when they were written. Do not treat an old audit,
session ID or permission grant as a current instruction. Search before reading
large documents, and never bulk-load audit data or images.
