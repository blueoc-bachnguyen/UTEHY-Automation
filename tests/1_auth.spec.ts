import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS, PASSWORD, MESSAGES, URLS } from '../utils/constants';

test.describe('1. Authentication Tests', () => {
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo(URLS.BASE);
  });

  test('Valid login', async ({ page }) => {
    await loginPage.login(USERS.STANDARD, PASSWORD);
    await expect(page).toHaveURL(URLS.INVENTORY);
  });

  test('Invalid login', async () => {
    await loginPage.login(USERS.STANDARD, 'wrong');
    expect(await loginPage.errorMsg.textContent()).toContain(MESSAGES.LOGIN_FAIL);
  });

  test('Locked-out user', async () => {
    await loginPage.login(USERS.LOCKED, PASSWORD);
    expect(await loginPage.errorMsg.textContent()).toContain(MESSAGES.LOCKED);
  });

  test('Logout redirects to login', async ({ page }) => {
    await loginPage.login(USERS.STANDARD, PASSWORD);
    await loginPage.logout();
    await expect(page).toHaveURL(URLS.BASE);
  });

  test('Session persistence', async ({ page }) => {
    await loginPage.login(USERS.STANDARD, PASSWORD);
    await page.reload();
    await expect(page).toHaveURL(URLS.INVENTORY);
    await expect(loginPage.cartLink).toBeVisible();
  });
});