import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://localhost:3178',
    headless: true,
    channel: 'chrome',
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: 'npm run start -- --port 3178',
    url: 'http://localhost:3178',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
