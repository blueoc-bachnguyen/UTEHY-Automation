import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  /* 1. Tăng Timeout tổng cho mỗi Test Case lên 60s (Mặc định 30s là hơi ít với Firefox/CI) */
  timeout: 60 * 1000,

  /* 2. Tăng thời gian chờ expect (ví dụ: chờ element visible) lên 10s */
  expect: {
    timeout: 10 * 1000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* 3. Thêm 'list' để xem được log lỗi chi tiết trên màn hình Console của GitHub Actions/Terminal */
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],

  use: {
    /* 4. Thêm Action Timeout: Thời gian chờ cho các hành động click/fill */
    actionTimeout: 15 * 1000,

    screenshot: 'on-first-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
