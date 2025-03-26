import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/**/*.ts'],
    ignores: ['node_modules/', 'dist/'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'no-console': 'warn', // `console.log` 사용에 대한 경고
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
