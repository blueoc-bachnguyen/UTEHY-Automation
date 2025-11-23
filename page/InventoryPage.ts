import { Page, expect } from '@playwright/test';
import { BasePage } from '../page/base.page';


export class InventoryPage extends BasePage {
private inventoryItems = this.page.locator('.inventory_item');
private cartBadge = this.page.locator('.shopping_cart_badge');
private menuButton = this.page.locator('#react-burger-menu-btn');
private logoutLink = this.page.locator('#logout_sidebar_link');


async addProduct(name: string) {
const btn = this.inventoryItems.filter({ hasText: name }).locator('button');
await btn.click();
}


async removeProduct(name: string) {
const btn = this.inventoryItems.filter({ hasText: name }).locator('button');
await btn.click();
}


async getCartCount(): Promise<number> {
if ((await this.cartBadge.count()) === 0) return 0;
return Number(await this.cartBadge.textContent());
}


async logout() {
await this.menuButton.click();
await this.logoutLink.click();
}
}