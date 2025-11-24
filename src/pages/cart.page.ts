import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class CartPage extends BasePage {
  private items: Locator;
  private checkoutBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('.cart-item');
    this.checkoutBtn = page.locator('[data-test="checkout"]');
  }

  async removeItem(name: string) {
    await this.items.filter({ hasText: name }).locator('button').click();
  }

  async checkOut() {
    await this.checkoutBtn.click();
  }

  getItemName(name: string): Locator {
    return this.page.locator('.inventory_item_name', { hasText: name });
  }

  async getItemCount(): Promise<number> {
    return await this.items.count();
  }
}
