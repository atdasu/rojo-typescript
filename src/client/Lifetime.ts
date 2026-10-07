interface Entry {
  connections: RBXScriptConnection[];
  cleanup?: () => void;
  stopped: boolean;
}

const entries = new Map<Instance, Entry>();

function entryFor(owner: Instance): Entry {
  let entry = entries.get(owner);
  if (!entry) {
    entry = { connections: [], stopped: false };
    entries.set(owner, entry);
  }
  return entry;
}

function stop(owner: Instance, entry: Entry) {
  if (entry.stopped) return;
  entry.stopped = true;

  for (const connection of entry.connections) {
    connection.Disconnect();
  }
  entry.connections.clear();
  entries.delete(owner);

  const cleanup = entry.cleanup;
  entry.cleanup = undefined;
  if (cleanup) cleanup();
}

/**
 * Runs a cleanup exactly once when an instance is destroyed or leaves its root.
 * `bind` registers the cleanup and `watch` starts observing; they may be called in
 * either order. Call `watch` from a different script than the one being observed:
 * a handler connected by a script is cancelled together with that script.
 *
 * Members are arrow functions so they compile to plain `Lifetime.bind(...)` calls.
 */
export const Lifetime = {
  /** Registers the cleanup for `owner` and returns a function that runs it early. */
  bind: (owner: Instance, root: Instance, cleanup: () => void): (() => void) => {
    const entry = entryFor(owner);
    assert(!entry.cleanup, "Lifetime already bound");
    entry.cleanup = cleanup;

    if (!owner.IsDescendantOf(root)) stop(owner, entry);

    return () => stop(owner, entry);
  },

  /** Starts observing `owner`; its cleanup runs once it is destroyed or leaves `root`. */
  watch: (owner: Instance, root: Instance) => {
    const entry = entryFor(owner);
    assert(entry.connections.size() === 0, "Lifetime already watched");

    entry.connections.push(owner.Destroying.Connect(() => stop(owner, entry)));
    entry.connections.push(
      owner.AncestryChanged.Connect(() => {
        if (!owner.IsDescendantOf(root)) stop(owner, entry);
      }),
    );

    if (!owner.IsDescendantOf(root)) stop(owner, entry);
  },
};
