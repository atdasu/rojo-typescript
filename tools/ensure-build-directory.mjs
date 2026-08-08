import { mkdir } from "node:fs/promises";

await mkdir("build", { recursive: true });
