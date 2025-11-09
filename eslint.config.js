const js = require('@eslint/js')
const globals = require('globals')
const nextPlugin = require('@next/eslint-plugin-next')
const tsParser = require('@typescript-eslint/parser')

const nextPluginConfig = {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
}

module.exports = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'pnpm-lock.yaml',
      'coverage/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['*.config.js', '*.config.cjs', '*.config.mjs', 'postcss.config.js', 'next.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {},
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        React: 'writable',
        process: 'readonly',
      },
    },
    ...nextPluginConfig,
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'writable',
        process: 'readonly',
      },
    },
    ...nextPluginConfig,
  },
]
