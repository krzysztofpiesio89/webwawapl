import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "prisma/**",
  ]),
  {
    rules: {
      // Prisma driver adapters require `any` casts due to type generation issues
      "@typescript-eslint/no-explicit-any": "off",
      // Dynamic require() is needed for conditional adapter loading
      "@typescript-eslint/no-require-imports": "off",
      // Unused vars prefixed with _ are allowed
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
]);

export default eslintConfig;
