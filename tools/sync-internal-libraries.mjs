import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const librariesDirectory = path.join(repositoryRoot, "libraries");
const generatedDirectory = path.join(repositoryRoot, "src", "shared", "InternalLibraries");

export async function syncInternalLibraries() {
  await rm(generatedDirectory, { recursive: true, force: true });
  await mkdir(generatedDirectory, { recursive: true });

  const entries = await readdir(librariesDirectory, { withFileTypes: true });
  for (const entry of entries.filter((candidate) => candidate.isDirectory())) {
    const sourceDirectory = path.join(librariesDirectory, entry.name, "src");
    const targetDirectory = path.join(generatedDirectory, entry.name);
    await cp(sourceDirectory, targetDirectory, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncInternalLibraries();
}
