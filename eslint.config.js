import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ❌ Ignore build & reports
  globalIgnores([
    'dist',
    'playwright-report',
    'test-results',
    'coverage',
  ]),

  // 🌐 Browser / React source files
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      'playwright.config.js',
      'vite.config.js',
    ],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // 🧪 Vitest + MSW + setup.js
  {
    files: [
      '**/*.test.{js,jsx}',
      '**/*.spec.{js,jsx}',
      '**/test/**/*.{js,jsx}',
      '**/__tests__/**/*.{js,jsx}'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest
      }
    }
  },

  // ⚙️ Node config files
  {
    files: [
      'playwright.config.js',
      'vite.config.js',
      '*.config.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
  },
])
