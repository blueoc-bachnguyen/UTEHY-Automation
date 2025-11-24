import { Locator, Page } from '@playwright/test';

export async function clickWithRetry(locator: Locator, attempts = 3, delay = 300) {
  for (let i = 0; i < attempts; i++) {
    try {
      await locator.waitFor({ state: 'visible', timeout: 2000 });
      await locator.click();
      return;
    } catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
