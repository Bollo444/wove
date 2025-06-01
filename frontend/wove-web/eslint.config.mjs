import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import nextEslintPlugin from '@next/eslint-plugin-next';
import reactEslintPlugin from 'eslint-plugin-react';
import reactHooksEslintPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config({
  extends: [eslintConfigPrettier],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    prettier: eslintPluginPrettier,
    react: reactEslintPlugin,
    'react-hooks': reactHooksEslintPlugin,
    '@next/next': nextEslintPlugin,
  },
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.json'],
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-duplicate-imports': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignores: ['node_modules/', '.next/', 'out/', 'public/'],
});
