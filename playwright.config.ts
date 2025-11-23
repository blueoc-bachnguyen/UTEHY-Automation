import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Chạy các file song song */
  fullyParallel: true,
  /* Nếu trên CI mà lỡ để test.only thì fail luôn */
  forbidOnly: !!process.env.CI,
  /* Trên CI thì retry 2 lần, local thì 0 */
  retries: process.env.CI ? 2 : 0,
  /* CI chạy 1 worker cho ổn định hơn */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  /* Cấu hình dùng chung cho tất cả project/browsers */
  use: {
    /* Base URL cho saucedemo – rất quan trọng */
    baseURL: 'https://www.saucedemo.com',

    /* Bật trace khi test fail (xem lại flow chạy) */
    trace: 'retain-on-failure',

    /* Screenshot khi fail */
    screenshot: 'only-on-failure',

    /* Video khi fail */
    video: 'retain-on-failure',
  },

  /* Chạy trên 3 browser: chromium, firefox, webkit */
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

  /* Nếu sau này test web local thì bật phần này lên */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
