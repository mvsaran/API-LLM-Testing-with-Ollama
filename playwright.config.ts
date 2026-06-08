import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { open: 'never' }],
    ['./utils/reportGenerator.ts'] // Custom reporter for AI metrics
  ],
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com', // Base URL for standard API tests
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*api\.spec\.ts/,
    },
    {
      name: 'LLM Tests',
      testMatch: /.*llm-tests\/.*\.spec\.ts/,
    },
    {
      name: 'Edge Cases',
      testMatch: /.*edge-cases\/.*\.spec\.ts/,
    }
  ],
});
