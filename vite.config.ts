/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: { entry: resolve(__dirname, 'lib/main.ts'), formats: ['es', 'cjs'] },
  },
  test: {
    environment: 'happy-dom',
  },
  plugins: [dts()],
});
