import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
testDir: './tests',
timeout: 30000,
expect: { timeout: 5000 },
fullyParallel: true,
retries: 1,
reporter: [['list'], ['html']],
use: {
baseURL: 'https://www.saucedemo.com',
headless: true,
viewport: { width: 1280, height: 720 },
actionTimeout: 10000,
trace: 'on-first-retry',
video: 'retain-on-failure',
screenshot: 'only-on-failure'
},
projects: [
{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
{ name: 'webkit', use: { ...devices['Desktop Safari'] } }
]
});