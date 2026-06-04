import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/node_modules", "**/coverage"]), {
    extends: compat.extends("eslint:recommended"),


    languageOptions: {
        ecmaVersion: 2021,
        sourceType: "script",
        globals: {
          // Browser globals
          document: "readonly",
          window: "readonly",
          localStorage: "readonly",
          alert: "readonly",
          console: "readonly",
          module: "readonly",
          require: "readonly",
          // Your app globals
          // state: "writable",
          // Jest globals
          describe: "readonly",
          it: "readonly",
          expect: "readonly",
          beforeEach: "readonly",
        },
      },
    ignores: ["**/node_modules", "**/coverage", "**/bootstrap.min.js"],

    rules: {
        "no-unused-vars": "warn",
        "no-console": "warn",
        eqeqeq: "error",
        semi: ["error", "always"],
    },
}]);