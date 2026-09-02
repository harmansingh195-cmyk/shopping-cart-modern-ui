const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    trace: 'on-first-retry',
  },
});
