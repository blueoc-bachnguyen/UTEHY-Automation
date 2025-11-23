import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigate();
  });

  test('should allow a standard user to login', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.expectToBeLoggedIn();
    await productsPage.expectAppLogoVisible();
    await productsPage.expectShoppingCartLinkVisible();
  });

  test('should prevent login with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    await loginPage.expectErrorMessage('Epic sadface: Username and password do not match any user in this service');
    await loginPage.expectToBeLoggedOut();
  });

  test('should prevent login for a locked out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    await loginPage.expectToBeLoggedOut();
  });

  test('should allow user to logout and redirect to login page', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.expectToBeLoggedIn();
    await productsPage.logout();
    await loginPage.expectToBeLoggedOut();
  });

  test('session should persist after page reload when logged in', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.expectToBeLoggedIn();
    await page.reload();
    await loginPage.expectToBeLoggedIn(); 
    await productsPage.expectAppLogoVisible();
  });

  test('should not allow adding items without login', async ({ page }) => {
    await page.goto('/inventory.html');
    await loginPage.expectToBeLoggedOut();
    await loginPage.expectErrorMessage('Epic sadface: You can only access \'/inventory.html\' when you are logged in.');

    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.navigate();
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);
  });
});