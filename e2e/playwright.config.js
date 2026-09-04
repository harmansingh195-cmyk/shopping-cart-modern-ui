// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright config for verifying the Product Search Box feature
 * (Jira EPMCDMETST-62766) against the running Spring Boot storefront.
 *
 * The app is started independently (mvn spring-boot:run) by the verification
 * process, so `webServer` is intentionally NOT configured here to avoid
 * double-starting the app or requiring Maven to be invoked from Node.
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
