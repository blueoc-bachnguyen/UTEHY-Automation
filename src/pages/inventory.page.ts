import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage extends BasePage {
  readonly inventoryItems: Locator;
  readonly cart: Locator;
  readonly menuBtn: Locator;
  readonly logoutLink: Locator;
  readonly sortSelect: Locator;
  readonly inventoryLink: Locator;
  readonly aboutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.cart = page.locator('.shopping_cart_badge');
    this.menuBtn = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.sortSelect = page.locator('.product_sort_container');
    this.inventoryLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
  }

  async waitForLoaded() {
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async addProduct(name: string) {
    await this.waitForLoaded();
    const btn = this.inventoryItems.filter({ hasText: name }).locator('button');
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async removeProduct(name: string) {
    const btn = this.inventoryItems.filter({ hasText: name }).locator('button');
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async addMultiProduct(names: string[]) {
    for (const name of names) {
      await this.addProduct(name);
    }
  }

  async getCartCount(): Promise<number> {
    const exists = await this.cart.count();
    if (!exists) return 0;
    return Number(await this.cart.textContent());
  }

  async getProductInfo(name: string) {
    const item = this.inventoryItems.filter({ hasText: name });
    return {
      name: await item.locator('.inventory_item_name').innerText(),
      description: await item.locator('.inventory_item_desc').innerText(),
      price: await item.locator('.inventory_item_price').innerText(),
    };
  }

  async openProductDetail(name: string) {
    await this.inventoryItems.filter({ hasText: name }).locator('.inventory_item_name').click();
  }

  async goBackToInventory() {
    await this.page.locator('#back-to-products').click();
  }

  async sort(value: string) {
    await this.sortSelect.selectOption(value);
  }

  async getAllProductNames(): Promise<string[]> {
    return this.inventoryItems.locator('.inventory_item_name').allInnerTexts();
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async imageLoaded(index: number): Promise<boolean> {
    const img = this.inventoryItems.nth(index).locator('img.inventory_item_img');
    await expect(img).toBeVisible();

    return img.evaluate((el: HTMLImageElement) => {
      return el.complete && el.naturalHeight > 0 && el.naturalWidth > 0;
    });
  }

  async logout() {
    await this.menuBtn.click();
    await this.logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutLink.click();
  }

  async expectMenuItemsVisible() {
    await this.menuBtn.click();
    await expect(this.inventoryLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    await expect(this.resetLink).toBeVisible();
  }
}
