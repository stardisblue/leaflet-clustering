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
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
        'spec/**/*.browser.spec.ts',
      ],
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
