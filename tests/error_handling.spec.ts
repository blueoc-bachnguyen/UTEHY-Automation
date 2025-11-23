import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Error Handling and Edge Cases', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('should validate error messages for failed login', async () => {
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'invalid_password');
    await loginPage.expectErrorMessage('Epic sadface: Username and password do not match any user in this service');
    await loginPage.page.reload();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });

  test('should validate error messages for failed checkout (missing fields)', async () => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.navigate();
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.expectErrorMessage('Error: First Name is required');
  });

  test('should not allow checkout with empty cart', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.navigate();
    await productsPage.resetAppState(); 
    await productsPage.goToCart();
    await cartPage.navigate();
    await cartPage.checkout();
    await expect(page).toHaveURL('/checkout-step-one.html');
    await checkoutPage.fillShippingInfo('Empty', 'Cart', '00000');
    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(page.locator('.cart_item')).toHaveCount(0); 
    await checkoutPage.finishCheckout();
    await checkoutPage.expectCheckoutComplete(); 
    await checkoutPage.backHome();
    await productsPage.expectCartBadgeCount(0);
  });

  test('should redirect to login if attempting to access checkout page directly without login', async ({ page }) => {
    await page.goto('/checkout-step-one.html');
    await loginPage.expectToBeLoggedOut();
    await loginPage.expectErrorMessage('Epic sadface: You can only access \'/checkout-step-one.html\' when you are logged in.');
  });

  test('should handle flaky selectors using retry/wait strategies (example)', async ({ page }) => {
    await loginPage.navigate();
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 10000 }); 
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.expectAppLogoVisible();
  });

  test('should simulate network delay and verify stability', async ({ page }) => {
    await page.route('**/*', async route => {
      await page.waitForTimeout(500);
      route.continue();
    });

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.expectToBeLoggedIn();
    await productsPage.expectAppLogoVisible();
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);
  });
});