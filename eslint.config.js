import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jest from 'eslint-plugin-jest'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import globals from "globals";
import path from 'path'
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { fileURLToPath } from 'url'
import { fixupPluginRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    ignores: ['dist/**', 'node_modules/**', "build/**", "*.config.*"],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}', 'src/*.{ts,tsx}', 'test/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        JSX: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jest': jest,
      "react-hooks": fixupPluginRules(reactHooksPlugin),
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/method-signature-style': ['error', 'method'],
    },
  },
]
