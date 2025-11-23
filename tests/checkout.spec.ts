import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Flow Tests', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.navigate();
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.goToCart();
    await cartPage.checkout();
  });

  test('should complete checkout process with valid user info', async () => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await checkoutPage.expectCheckoutComplete();
    await checkoutPage.backHome();
    await loginPage.expectToBeLoggedIn(); 
    await productsPage.expectCartBadgeCount(0); 
  });

  test('should show error for missing required fields during checkout', async () => {
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.expectErrorMessage('Error: First Name is required');
    await checkoutPage.page.reload(); 
    await checkoutPage.fillShippingInfo('John', '', '12345');
    await checkoutPage.expectErrorMessage('Error: Last Name is required');
    await checkoutPage.page.reload();
    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await checkoutPage.expectErrorMessage('Error: Postal Code is required');
  });

  test('should verify total price calculation with multiple items and tax', async ({ page }) => {
    const expectedItemTotal = 29.99 + 9.99; 
    const expectedTaxRate = 0.08;
    const expectedTax = expectedItemTotal * expectedTaxRate; 
    await checkoutPage.fillShippingInfo('Test', 'User', '10001');
    await checkoutPage.verifyOrderSummary(expectedItemTotal, expectedTax);
    await checkoutPage.finishCheckout();
    await checkoutPage.expectCheckoutComplete();
  });

  test('should verify that cart contents are preserved on checkout cancel', async () => {
    await checkoutPage.fillShippingInfo('Test', 'User', '10001');
    await checkoutPage.cancelCheckout(); 
    await expect(checkoutPage.page).toHaveURL('/cart.html');
    await cartPage.expectCartItemCount(2); 
    await cartPage.expectProductInCart('Sauce Labs Backpack');
    await cartPage.expectProductInCart('Sauce Labs Bike Light');
  });

  test('should block checkout with an empty cart', async ({ page }) => {
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
  });

  test('should redirect to login if attempting to access checkout directly without login', async ({ page }) => {
    await productsPage.logout(); 
    await page.goto('/checkout-step-one.html');
    await loginPage.expectToBeLoggedOut(); 
    await loginPage.expectErrorMessage('Epic sadface: You can only access \'/checkout-step-one.html\' when you are logged in.');
  });
});