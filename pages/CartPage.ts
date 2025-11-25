import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async removeProduct(name: string) {
    const item = this.items.filter({ hasText: name });
    await item.locator("button").click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async getItemCount() {
    return await this.items.count();
  }
}
