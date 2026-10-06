import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "**/*.code-workspace"] },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: { alwaysTryTypes: true, project: "./jsconfig.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      "import/no-unresolved": "error",
      "import/default": "error",
      "import/named": "error",
      "import/namespace": "error",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "react-refresh/only-export-components": "warn",
      "no-unused-vars": "off",
      "react/prop-types": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: { globals: globals.browser },
    rules: { "no-console": "warn" },
  },
  {
    files: ["vite.config.*", "eslint.config.*", "prettier.config.*"],
    languageOptions: { globals: globals.node },
  },
  prettierConfig,
);
