import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/login.page';
import { InventoryPage } from '../page/InventoryPage';


test('valid login', async ({ page }) => {
const login = new LoginPage(page);
const inventory = new InventoryPage(page);
await login.goto('/');
await login.login('standard_user', 'secret_sauce');
await expect(page).toHaveURL(/inventory.html/);
await inventory.logout();
});


test('invalid login', async ({ page }) => {
const login = new LoginPage(page);
await login.goto('/');
await login.login('wrong', 'creds');
await login.expectErrorContains('Username and password');
});