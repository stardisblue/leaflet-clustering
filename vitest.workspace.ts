import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // This will keep running your existing tests.
  // If you don't need to run those in Node.js anymore,
  // You can safely remove it from the workspace file
  // Or move the browser test configuration to the config file.
  {
    extends: 'vite.config.ts',
    test: {
      name: 'node',
      exclude: ['spec/**/*.browser.spec.ts'],
      include: ['lib/**/*.{test,spec}.ts', 'spec/**/*.{test,spec}.ts'],
    },
  },
  {
    extends: 'vite.config.ts',
    test: {
      name: 'browser',
      include: ['spec/**/*.browser.spec.ts'],
      browser: {
        enabled: true,
        headless: true,
        name: 'webkit',
        provider: 'playwright',
        // https://playwright.dev
        providerOptions: {},
      },
    },
  },
]);
