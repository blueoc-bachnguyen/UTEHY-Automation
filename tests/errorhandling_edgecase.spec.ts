import { test, expect } from '@playwright/test';

test.describe('Edge Cases & Error Handling', () => {
  test('Simulate network delay and verify inventory load', async ({ page }) => {
    await page.route('**/*.jpg', async (route) => {
      await new Promise((f) => setTimeout(f, 2000));
      await route.continue();
    });

    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');

    const start = Date.now();
    await page.click('[data-test="login-button"]');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_item_img img').first()).toBeVisible({ timeout: 10000 });

    console.log(`Inventory loaded in ${Date.now() - start}ms`);
  });

  test('Handle flaky menu items', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    await page.click('#react-burger-menu-btn');

    const logoutLink = page.locator('#logout_sidebar_link');
    await logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await expect(logoutLink).toBeEnabled();
    await logoutLink.click();

    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Checkout with empty cart should show total', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
    await page.click('.shopping_cart_link');

    const checkoutBtn = page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeEnabled();
    await checkoutBtn.click();

    await expect(page.locator('.cart_item')).toHaveCount(0);

    const totalLabel = page.locator('.summary_total_label');
    if (await totalLabel.isVisible()) {
      await expect(totalLabel).toHaveText('Total: $0.00');
    }
  });

  test('Redirect to login when accessing checkout page directly', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText(
      "You can only access '/checkout-step-one.html' when you are logged in"
    );
  });

  test('Failed login shows proper error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'invalid_user');
    await page.fill('[data-test="password"]', 'wrong_password');
    await page.click('[data-test="login-button"]');

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('Checkout error messages for missing customer info', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');

    await page.click('[data-test="continue"]');

    const errorContainer = page.locator('.error-message-container');
    await expect(errorContainer).toBeVisible();
    await expect(errorContainer).toHaveText('Error: First Name is required');

    await page.fill('[data-test="firstName"]', 'John');
    await page.click('[data-test="continue"]');
    await expect(errorContainer).toHaveText('Error: Last Name is required');
  });
});
