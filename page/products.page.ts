import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  inventoryItems: Locator;
  cartBadge = this.page.locator('.shopping_cart_badge');
  menuBtn = this.page.locator('#react-burger-menu-btn');
  menuLogout = this.page.locator('#logout_sidebar_link');

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
  }

  async addToCartByName(name: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('button').click();
  }

  async removeFromCartByName(name: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('button').click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async productCountInCart() {
    return await this.cartBadge.count() ? parseInt(await this.cartBadge.innerText()) : 0;
  }

  async openProductDetail(name: string) {
    await this.page.locator('.inventory_item').filter({ hasText: name }).locator('.inventory_item_name').click();
  }

  async sortBy(option: string) {
    await this.page.locator('.product_sort_container').selectOption({ label: option });
  }
}
