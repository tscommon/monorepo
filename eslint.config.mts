import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  },
  {
    ignores: [
      '**/dist/',
      '**/build/',
      '**/.docusaurus/',
      '**/node_modules/',
      '**/coverage/',
      '**/examples/',
      '**/*.test.ts',
      'rollup.config.js',
      '_site',
    ],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/class-literal-property-style': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'error',
    },
  },
]);
