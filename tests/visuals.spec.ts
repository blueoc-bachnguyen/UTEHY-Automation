import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { BasePage } from '../pages/BasePage';
import { CartPage } from '../pages/CartPage';

test.describe('Visual and UI Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let basePage: BasePage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    basePage = new BasePage(page);
    cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.navigate();
  });

  test('should verify menu items are visible', async () => {
    await basePage.expectMenuItemsVisible();
  });

  test('should verify adaptive layout for desktop and mobile', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(basePage.appLogo).toBeVisible();
    await expect(productsPage.sortDropdown).toBeVisible();
    await page.setViewportSize({ width: 375, height: 667 }); 
    await expect(basePage.appLogo).toBeVisible();
    await expect(productsPage.sortDropdown).toBeVisible(); 
    await expect(productsPage.menuButton).toBeVisible();
  });

  test('should verify UI elements enabled/disabled based on state', async () => {
    await productsPage.expectCartBadgeCount(0);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);
    await productsPage.removeProductFromCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(0);
    await productsPage.goToCart();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('should validate consistent product image sizes', async ({ page }) => {
    const images = await page.locator('.inventory_item_img').all();
    expect(images.length).toBeGreaterThan(0);

    let firstImageSize: { width: number; height: number } | null = null;

    for (const img of images) {
      const boundingBox = await img.boundingBox();
      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        if (!firstImageSize) {
          firstImageSize = { width: boundingBox.width, height: boundingBox.height };
        } else {
          expect(boundingBox.width).toBeCloseTo(firstImageSize.width, 5); 
          expect(boundingBox.height).toBeCloseTo(firstImageSize.height, 5);
        }
      }
    }
  });

  test('should capture screenshot of product page', async ({ page }) => {
    await page.screenshot({ path: 'test-results/product-page-screenshot.png' });
    console.log('Screenshot of product page taken.');
  });
});