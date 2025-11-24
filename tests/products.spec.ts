import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/login.page';
import { InventoryPage } from '../page/InventoryPage';


test('add and remove product', async ({ page }) => {
const login = new LoginPage(page);
const inventory = new InventoryPage(page);


await login.goto('/');
await login.login('standard_user', 'secret_sauce');


await inventory.addProduct('Sauce Labs Backpack');
expect(await inventory.getCartCount()).toBe(1);


await inventory.removeProduct('Sauce Labs Backpack');
expect(await inventory.getCartCount()).toBe(0);


await inventory.logout();
});