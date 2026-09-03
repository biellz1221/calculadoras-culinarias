import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      'calculadora gelato/**',
      'references/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // A autodetecção de versão do eslint-plugin-react ainda usa uma API que o
    // ESLint 10 removeu; declarar a versão pula esse caminho.
    settings: { react: { version: '19.2' } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];

export default config;
