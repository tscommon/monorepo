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
        '**/*.d.ts',
        '**/*.test-d.ts',
        '**/release.config.*',
        '**/index.ts', // exclude index.ts files
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
