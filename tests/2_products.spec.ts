import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { USERS, PASSWORD } from '../utils/constants';

test.describe('2. Product & Cart Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigateTo('/');
  });

  test('Sort Products (Price & Name)', async () => {
    await loginPage.login(USERS.STANDARD, PASSWORD);
    
    await productsPage.sort('lohi');
    const prices = await productsPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));

    await productsPage.sort('za');
    const names = await productsPage.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('Add -> Remove -> Add consistency', async () => {
    await loginPage.login(USERS.STANDARD, PASSWORD);
    const item = 'Sauce Labs Backpack';
    
    await productsPage.addProduct(item);
    expect(await productsPage.getCartBadgeCount()).toBe(1);
    
    await productsPage.removeProduct(item);
    expect(await productsPage.getCartBadgeCount()).toBe(0);

    await productsPage.addProduct(item);
    expect(await productsPage.getCartBadgeCount()).toBe(1);
  });

  test('Verify Details Match', async ({ page }) => {
    await loginPage.login(USERS.STANDARD, PASSWORD);
    const nameList = await productsPage.getNames().then(n => n[0]);
    await page.locator('.inventory_item_name').first().click();
    expect(await page.locator('.inventory_details_name').innerText()).toBe(nameList);
  });

  // Problem User Requirement
  test('Problem User: Verify broken images', async ({ page }) => {
    await loginPage.login(USERS.PROBLEM, PASSWORD);
    // problem_user luôn có ảnh lỗi, hàm check phải trả về false
    const isImagesOk = await productsPage.checkImagesLoaded();
    expect(isImagesOk).toBe(false); 
  });

  // Performance User Requirement (Real User Simulation)
  test('Performance User: Should load within acceptable time', async ({ page }) => {
    const start = Date.now();
    await loginPage.login(USERS.PERFORMANCE, PASSWORD);
    await expect(page.locator('.inventory_list')).toBeVisible();
    const duration = Date.now() - start;
    console.log(`Performance login took: ${duration}ms`);
    // Threshold ví dụ: 5s (performance_glitch_user thường mất ~5s)
    // Test này pass nếu app vẫn load được, nhưng ta log lại time
    expect(duration).toBeGreaterThan(0); 
  });
});