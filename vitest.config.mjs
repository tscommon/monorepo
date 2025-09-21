import codspeedPlugin from '@codspeed/vitest-plugin';
import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      exclude: [
        ...defaultExclude,
        '**/bin/**',
        '**/_site/**',
        '**/coverage/**',
        '**/build/**',
        '**/examples/**',
        '**/index.ts',
        '**/*.bench.ts',
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
  plugins: [codspeedPlugin()],
});
