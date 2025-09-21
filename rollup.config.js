import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import path from 'path';

function includeCode() {
  return {
    name: 'include-code',
    writeBundle(options, files) {
      const moduleName = path.basename(process.cwd());
      const outDir = path.dirname(options.file);
      for (const file of Object.values(files)) {
        if (file.type === 'asset' && file.fileName.endsWith('.d.ts')) {
          fs.writeFileSync(
            path.join(outDir, file.fileName),
            file.source.replaceAll(/^(\s+\*\s)\{\@includeCode ([^\}]+)\}$/gm, (_, pad, filePath) => {
              const lines = [];
              lines.push('```ts');
              lines.push(
                ...fs
                  .readFileSync(path.resolve(outDir, filePath), 'utf-8')
                  .trim()
                  .replace('../src/index.js', `@tscommon/${moduleName}`)
                  .split('\n'),
              );
              lines.push('```');
              return lines.map((line) => pad + line).join('\n');
            }),
            'utf-8',
          );
        }
      }
    },
  };
}

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    sourcemap: true,
    strict: true,
    format: 'module',
  },
  external: [/^@tscommon\/.*/],
  plugins: [
    typescript({
      outDir: 'dist',
      sourceMap: true,
      declaration: true,
      removeComments: false,
      declarationMap: true,
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts'],
      target: 'ESNext',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
    }),
    terser({
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    }),
    includeCode(),
  ],
};
