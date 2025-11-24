import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/login.page';
import { InventoryPage } from '../page/InventoryPage';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Valid login', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.login('standard_user', 'secret_sauce');

    await inventory.waitForLoaded();
  });

  test('Invalid login', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login('wrong_user', 'wrong_password');

    await login.expecErrorContains('Username and password');
  });

  test('locked-out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expecErrorContains('user has been locked out.');
  });

  test('session persistence after reload', async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);

    await inventory.waitForLoaded();

    if (browserName === 'webkit') {
      await page.goto(page.url(), { waitUntil: 'load' });
    } else {
      await page.reload();
    }

    await inventory.waitForLoaded();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});