import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["build", "build-server", "node_modules"] },
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      /*
       * eslint-plugin-react is not installed, so nothing teaches this rule
       * that JSX uses a variable — every imported component would report as
       * unused. The capitalised-identifier exemption stands in for that.
       *
       * argsIgnorePattern covers the same thing for a component destructured
       * out of a dynamic import: `import(…).then(({ default: Page }) => …)`.
       */
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^[A-Z_]", argsIgnorePattern: "^[A-Z_]" },
      ],
    },
  },
];
