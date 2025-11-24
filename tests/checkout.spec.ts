import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/login.page';
import { InventoryPage } from '../page/InventoryPage';
import { CartPage } from '../page/cart.page';
import { CheckoutPage } from '../page/checkout.page';


test('complete checkout', async ({ page }) => {
const login = new LoginPage(page);
const inventory = new InventoryPage(page);
const cart = new CartPage(page);
const checkout = new CheckoutPage(page);


await login.goto('/');
await login.login('standard_user', 'secret_sauce');


await inventory.addProduct('Sauce Labs Backpack');
await inventory.addProduct('Sauce Labs Bike Light');


await page.click('.shopping_cart_link');
await cart.checkout();


await checkout.fillCustomer('John', 'Doe', '12345');
await checkout.continue();
await checkout.finish();


await expect(page.locator('.complete-header')).toContainText('THANK YOU FOR YOUR ORDER', { ignoreCase: true });

await inventory.logout();
});