import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const allowedScopes = packageJson.roblox?.runtimeNpmScopes;
const internalLibraryScope = packageJson.roblox?.internalLibraryScope;

if (
  !Array.isArray(allowedScopes) ||
  !allowedScopes.every((scope) => /^@[a-z0-9-]+$/i.test(scope)) ||
  !/^@[a-z0-9-]+$/i.test(internalLibraryScope ?? "")
) {
  throw new Error(
    "package.json must define roblox.runtimeNpmScopes and roblox.internalLibraryScope as npm scopes.",
  );
}

const invalidDependencies = Object.keys(packageJson.dependencies ?? {}).filter(
  (dependency) => !allowedScopes.some((scope) => dependency.startsWith(`${scope}/`)),
);

if (invalidDependencies.length > 0) {
  throw new Error(
    `Runtime npm dependencies must use an approved Roblox-compatible scope (${allowedScopes.join(", ")}). ` +
      `Move these packages to devDependencies or explicitly approve their scope after compatibility review: ${invalidDependencies.join(", ")}`,
  );
}

const librariesDirectory = fileURLToPath(new URL("../libraries/", import.meta.url));
const libraryEntries = await readdir(librariesDirectory, { withFileTypes: true });
for (const entry of libraryEntries.filter((candidate) => candidate.isDirectory())) {
  const manifestPath = path.join(librariesDirectory, entry.name, "package.json");
  const libraryPackageJson = JSON.parse(await readFile(manifestPath, "utf8"));
  const expectedName = `${internalLibraryScope}/${entry.name}`;

  if (libraryPackageJson.name !== expectedName) {
    throw new Error(
      `Internal library ${entry.name} must be named ${expectedName} in its package.json.`,
    );
  }
}

console.log("Runtime npm dependency policy passed.");
