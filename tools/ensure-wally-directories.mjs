import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

for (const directory of ["Packages", "ServerPackages"]) {
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, ".gitkeep"), "");
}
