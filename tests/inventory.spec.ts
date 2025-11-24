import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../page/login.page';
import { InventoryPage } from '../page/InventoryPage';

test.describe('Inventory Page Test', () => {
  let login: LoginPage;
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    inventory = new InventoryPage(page);
    await login.goto('https://www.saucedemo.com/');
  });

  test('add and remove single product', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    await inventory.waitForLoaded();

    await inventory.addProduct('Sauce Labs Backpack');
    await expect(await inventory.getCartCount()).toBe(1);

    await inventory.removeProduct('Sauce Labs Backpack');
    await expect(await inventory.getCartCount()).toBe(0);

    try {
      await inventory.logout();
    } catch (err) {}
  });

  test('add multiple products and remove', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    await inventory.waitForLoaded();

    await inventory.addMultiProduct(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await expect(await inventory.getCartCount()).toBe(2);

    await inventory.removeProduct('Sauce Labs Backpack');
    await inventory.removeProduct('Sauce Labs Bike Light');
    await expect(await inventory.getCartCount()).toBe(0);
    try {
      await inventory.logout();
    } catch (err) {}
  });

  test('verify product details match between list and detail page', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    await inventory.waitForLoaded();

    const productName = 'Sauce Labs Backpack';
    const info = await inventory.getProductInfo(productName);

    await inventory.openProductDetail(productName);

    const detailName = (await page.locator('.inventory_details_name').textContent())?.trim();
    const detailDesc = (await page.locator('.inventory_details_desc').textContent())?.trim();
    const detailPrice = (await page.locator('.inventory_details_price').textContent())?.trim();

    expect(detailName).toBe(info.name);
    expect(detailDesc).toBe(info.description);
    expect(detailPrice).toBe(info.price);

    await inventory.goBackToInventory();
    try {
      await inventory.logout();
    } catch (err) {}
  });

  test('verify product sorting A-Z', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    await inventory.waitForLoaded();

    await inventory.sort('az');
    const namesAZ = await inventory.getAllProductNames();
    const sortedNames = [...namesAZ].sort();
    expect(namesAZ).toEqual(sortedNames);
    try {
      await inventory.logout();
    } catch (err) {}
  });

  test('verify all product images load correctly', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    await inventory.waitForLoaded();

    const count = await inventory.getProductCount();
    for (let i = 0; i < count; i++) {
      expect(await inventory.imageLoaded(i)).toBeTruthy();
    }
    try {
      await inventory.logout();
    } catch (err) {}
  });

  test('All product images have valid dimensions', async ({ page }) => {
    const count = await inventory.getProductCount();

    for (let i = 0; i < count; i++) {
      const imgLoaded = await inventory.imageLoaded(i);
      expect(imgLoaded).toBeTruthy();

      const img = page.locator('.inventory_item_img img').nth(i);
      const width = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
      const height = await img.evaluate((el) => (el as HTMLImageElement).naturalHeight);

      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);

      const ratio = width / height;
      expect(ratio).toBeCloseTo(1, 1);
    }
  });

  test('cannot access inventory page without login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.locator('.btn_inventory')).toHaveCount(0);
  });
});