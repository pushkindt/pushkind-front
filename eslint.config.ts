import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
  },

  // Core JS rules
  js.configs.recommended,

  // TypeScript rules (tseslint exports an array for flat config)
  ...tseslint.configs.recommended,

  // React rules
  pluginReact.configs.flat.recommended,

  // Extra React settings
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Turn off rules that conflict with Prettier
  eslintConfigPrettier,
]);
