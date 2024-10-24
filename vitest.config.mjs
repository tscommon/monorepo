import { defineConfig, defaultExclude } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ...defaultExclude,
        '**/bin/**',
        '**/docs/**',
        '**/coverage/**',
        '**/build/**',
        '**/examples/**',
        '**/index.ts',
      ],
      reporter: ['lcov', 'html'],
      reportOnFailure: true,
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
