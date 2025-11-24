import { Page } from '@playwright/test';

export async function safeGoto(page: Page, url: string) {
  for (let i = 0; i < 2; i++) {
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      });
      return;
    } catch (err) {
      if (i === 1) throw err;
      await page.waitForTimeout(1000);
    }
  }
}
