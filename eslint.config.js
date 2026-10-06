import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
   settings: {
  react: { version: 'detect' },
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: './jsconfig.json',   
    },
    node: {
      extensions: ['.js', '.jsx'],
    },
  },
},
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // Ловят битые импорты
      'import/no-unresolved': 'error',
      'import/default': 'error',
      'import/named': 'error',
      'import/namespace': 'error',

      'react-refresh/only-export-components': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react/prop-types': 'off',
    },
  },
];