import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';

test.describe('Inventory Page Tests', () => {
  let login: LoginPage;
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    inventory = new InventoryPage(page);

    await login.goto('https://www.saucedemo.com/');
    await login.login('standard_user', 'secret_sauce');
    await inventory.waitForLoaded();
  });

  test('UI visual tests: menu items', async ({ page }) => {
    await inventory.expectMenuItemsVisible();
  });

  test('Inventory layout adapts to desktop & mobile', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Checkout button behavior when cart is empty', async ({ page }) => {
    await page.click('.shopping_cart_link');

    const cartCount = await inventory.getCartCount();
    expect(cartCount).toBe(0);

    const checkoutBtn = page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toBeEnabled();
  });

  test('Add product enables cart & checkout button', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    await inventory.addProduct(productName);

    const cartCount = await inventory.getCartCount();
    expect(cartCount).toBeGreaterThan(0);

    await page.click('.shopping_cart_link');
    const checkoutBtn = page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeEnabled();
  });
});
