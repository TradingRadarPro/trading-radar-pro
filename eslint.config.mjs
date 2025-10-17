// eslint.config.mjs (ESLint 9 - flat config)
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Permite reaproveitar configs "legadas" como 'next/core-web-vitals'
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // Presets do Next + TS + Prettier (desativa conflitos de formatação)
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),

  // Ignorar pastas/arquivos gerados
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  // Ajustes finos
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];

export default config;
