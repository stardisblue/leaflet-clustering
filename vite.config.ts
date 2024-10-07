/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: { entry: resolve(__dirname, 'lib/main.ts'), formats: ['es', 'cjs'] },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './lib'),
      '@spec': resolve(__dirname, './spec'),
    },
  },
  plugins: [
    dts({
      include: ['lib'],
      exclude: ['**/*.{spec,test}.ts'],
      rollupTypes: true,
    }),
  ],
});
