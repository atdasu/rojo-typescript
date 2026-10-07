type Cell = (value?: unknown) => unknown;

/** The part of Vide this module needs. Pass the real `Vide`, or a fake in tests. */
export interface Reactivity {
  source: (initial: never) => unknown;
  batch: (update: () => void) => void;
}

function equal(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (!typeIs(a, "table") || !typeIs(b, "table")) return false;

  const left = a as Map<unknown, unknown>;
  const right = b as Map<unknown, unknown>;
  for (const [key, value] of left) {
    if (!equal(value, right.get(key))) return false;
  }
  for (const [key] of right) {
    if (left.get(key) === undefined) return false;
  }
  return true;
}

/**
 * A stable read view with one Vide source per field. Reading `state().Ammo` only
 * subscribes to `Ammo`, so publishing a clock cannot invalidate unrelated UI.
 * Published tables are immutable snapshots that replace the whole state: fields
 * missing from the next snapshot become `undefined`. Deeply equal values are not
 * republished, and each publish is batched so observers see an atomic view.
 *
 * Vide is passed in rather than imported so this module also runs offline.
 *
 * @returns A function: call it with no argument to read, or with the next snapshot
 * to publish. Both forms return the read view.
 */
export function createReactiveState<T extends object>(
  vide: Reactivity,
  initial: T,
): (nextValue?: T) => Readonly<T> {
  const values = table.clone(initial) as unknown as Map<unknown, unknown>;
  const cells = new Map<unknown, Cell>();

  function cell(key: unknown): Cell {
    let existing = cells.get(key);
    if (!existing) {
      existing = vide.source(values.get(key) as never) as Cell;
      cells.set(key, existing);
    }
    return existing;
  }

  const view = setmetatable(
    {},
    {
      __index: (_, key) => cell(key)(),
      __newindex: () => error("ReactiveState views are read-only"),
    },
  ) as Readonly<T>;

  return (nextValue) => {
    if (nextValue === undefined) return view;
    const snapshot = nextValue as unknown as Map<unknown, unknown>;

    vide.batch(() => {
      for (const [key, value] of snapshot) {
        if (!equal(values.get(key), value)) {
          values.set(key, value);
          cell(key)(value);
        }
      }
      for (const [key] of values) {
        if (snapshot.get(key) === undefined) {
          values.delete(key);
          // An explicit undefined writes; calling with no argument would read.
          cell(key)(undefined);
        }
      }
    });

    return view;
  };
}
