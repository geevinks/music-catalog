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
  ]),
  {
    rules: {
      // Игнорируем предупреждения о img (используем обычные теги)
      "@next/next/no-img-element": "off",
      // Игнорируем предупреждения о alt для img
      "jsx-a11y/alt-text": "off",
      // Игнорируем неиспользуемые переменные
      "@typescript-eslint/no-unused-vars": "off",
      // Игнорируем prefer-const
      "prefer-const": "off",
      // Игнорируем missing dependencies в useEffect
      "react-hooks/exhaustive-deps": "off",
      // отключаем ошибку set-state-in-effect
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;