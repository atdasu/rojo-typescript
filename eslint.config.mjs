import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "eslint-config-prettier";
import robloxTs from "eslint-plugin-roblox-ts";
import tseslint from "typescript-eslint";

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: [
      "out/**",
      "Packages/**",
      "ServerPackages/**",
      "build/**",
      "src/shared/InternalLibraries/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir,
      },
    },
    plugins: {
      "roblox-ts": robloxTs,
    },
    rules: {
      ...robloxTs.configs.recommended.rules,
      "no-undef": "off",
    },
  },
  prettier,
];
