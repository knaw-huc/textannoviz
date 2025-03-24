import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import stylisticJs from "@stylistic/eslint-plugin-js";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["**/tailwind.*", "**/*.cjs", "**/*.js"]),
  {
    extends: fixupConfigRules(
      compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "prettier",
      ),
    ),
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "prefer-const": "error",
      "@stylistic/js/indent": [
        "error",
        2,
        {
          SwitchCase: 1,
          flatTernaryExpressions: false,
        },
      ],
      "@stylistic/js/quotes": [
        "error",
        "double",
        {
          allowTemplateLiterals: "always",
        },
      ],
      "simple-import-sort/imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },

    plugins: {
      react: fixupPluginRules(react),
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      "@stylistic/js": stylisticJs,
      "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: "./",
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
