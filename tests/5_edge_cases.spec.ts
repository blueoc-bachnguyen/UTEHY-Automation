import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MESSAGES, URLS } from '../utils/constants';

test.describe('5. Edge Cases', () => {
  
  test('Simulate Network Delay (Synthetic)', async ({ page }) => {
    await page.route('**/*.css', async route => {
      await new Promise(f => setTimeout(f, 2000)); // Delay CSS 2s
      await route.continue();
    });

    const login = new LoginPage(page);
    await login.navigateTo('/');
    await expect(login.loginBtn).toBeVisible({ timeout: 10000 }); // Retry/Wait strategy
    
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('Direct access without login', async ({ page }) => {
    await page.goto(URLS.INVENTORY);
    await expect(page).toHaveURL(URLS.BASE);
    const login = new LoginPage(page);
    expect(await login.errorMsg.textContent()).toContain(MESSAGES.REQ_LOGIN);
  });
});