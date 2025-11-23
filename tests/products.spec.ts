import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

test.describe('Product and Cart Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    productDetailsPage = new ProductDetailsPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.navigate();
  });

  test('should add multiple products to cart and verify count', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.expectCartBadgeCount(2);
    await productsPage.goToCart();
    await cartPage.expectCartItemCount(2);
    await cartPage.expectProductInCart('Sauce Labs Backpack');
    await cartPage.expectProductInCart('Sauce Labs Bike Light');
  });

  test('should remove product from cart', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);
    await productsPage.removeProductFromCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(0);
  });

  test('Add -> Remove -> Add again, verify consistency', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);
    await productsPage.removeProductFromCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(0);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);
  });

  test('should verify product details match between listing and detail page', async () => {
    const productName = 'Sauce Labs Backpack';
    const productDescription = 'carry.allTheThings() with the sleek, streamlined Sly Pack that just won\'t quit.';
    const productPrice = '$29.99';

    await productsPage.verifyProductDetails(productName, productDescription, productPrice);
    await productsPage.goToProductDetails(productName);
    await productDetailsPage.expectProductDetails(productName, productDescription, productPrice);
  });

  test('should verify product sorting functionality', async () => {
    await productsPage.sortProducts('az');
    let firstItem = await productsPage.inventoryItems.first().locator('.inventory_item_name').innerText();
    expect(firstItem).toBe('Sauce Labs Backpack');
    await productsPage.sortProducts('za');
    firstItem = await productsPage.inventoryItems.first().locator('.inventory_item_name').innerText();
    expect(firstItem).toBe('Test.allTheThings() T-Shirt (Red)');
    await productsPage.sortProducts('lohi');
    firstItem = await productsPage.inventoryItems.first().locator('.inventory_item_name').innerText();
    expect(firstItem).toBe('Sauce Labs Onesie');
    await productsPage.sortProducts('hilo');
    firstItem = await productsPage.inventoryItems.first().locator('.inventory_item_name').innerText();
    expect(firstItem).toBe('Sauce Labs Fleece Jacket');
  });

  test('should verify product images are loaded correctly', async () => {
    await productsPage.verifyProductImagesLoaded();
  });
});