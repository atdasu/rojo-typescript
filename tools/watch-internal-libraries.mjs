import { watch } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { syncInternalLibraries } from "./sync-internal-libraries.mjs";

const librariesDirectory = fileURLToPath(new URL("../libraries/", import.meta.url));
let pendingSync;

async function queueSync() {
  if (pendingSync) return;

  pendingSync = setTimeout(async () => {
    pendingSync = undefined;
    try {
      await syncInternalLibraries();
      console.log("Internal libraries synchronized.");
    } catch (error) {
      console.error("Failed to synchronize internal libraries.", error);
    }
  }, 100);
}

await syncInternalLibraries();
console.log("Watching internal libraries.");

watch(path.resolve(librariesDirectory), { recursive: true }, () => {
  void queueSync();
});
