import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';
import { CartPage } from '../src/pages/cart.page';
import { CheckOutPage } from '../src/pages/checkout.page';

test.describe('Checkout Flow', () => {
  let login: LoginPage;
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckOutPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckOutPage(page);

    await login.goto('https://www.saucedemo.com/');
    await login.login('standard_user', 'secret_sauce');
    await inventory.waitForLoaded();
  });

  test('should complete checkout successfully', async ({ page }) => {
    await inventory.addProduct('Sauce Labs Backpack');
    await inventory.addProduct('Sauce Labs Bike Light');

    await page.click('.shopping_cart_link');
    await cart.checkOut();

    await checkout.fillCustomer('John', 'Doe', '12345');
    await checkout.continueCheckout();
    await checkout.finishCheckout();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('should show error when postal code is missing', async ({ page }) => {
    await inventory.addProduct('Sauce Labs Backpack');
    await page.click('.shopping_cart_link');
    await cart.checkOut();

    await checkout.fillCustomer('John', 'Doe', '');
    await checkout.continueCheckout();

    await expect(checkout['errorMsg']).toHaveText('Error: Postal Code is required');
  });

  test('should show error when first name is missing', async ({ page }) => {
    await inventory.addProduct('Sauce Labs Backpack');
    await page.click('.shopping_cart_link');
    await cart.checkOut();

    await checkout.fillCustomer('', 'Doe', '12345');
    await checkout.continueCheckout();

    await expect(checkout['errorMsg']).toHaveText('Error: First Name is required');
  });

  test('should calculate total price correctly', async ({ page }) => {
    await inventory.addProduct('Sauce Labs Backpack');
    await inventory.addProduct('Sauce Labs Bike Light');

    await page.click('.shopping_cart_link');
    await cart.checkOut();

    await checkout.fillCustomer('John', 'Doe', '12345');
    await checkout.continueCheckout();

    const itemTotal = await checkout.getItemTotal();
    const tax = await checkout.getTax();
    const total = await checkout.getTotal();

    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('should keep items when checkout is cancelled', async ({ page }) => {
    await inventory.addProduct('Sauce Labs Backpack');

    await page.click('.shopping_cart_link');
    await cart.checkOut();

    await checkout.cancelCheckout();

    await expect(cart.getItemName('Sauce Labs Backpack')).toBeVisible();
  });

  test('should show confirmation summary before finishing', async ({ page }) => {
    await inventory.addProduct('Sauce Labs Onesie');
    await page.click('.shopping_cart_link');
    await cart.checkOut();

    await checkout.fillCustomer('John', 'Doe', '12345');
    await checkout.continueCheckout();

    await expect(page.locator('.title')).toHaveText('Checkout: Overview');

    await checkout.finishCheckout();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});
