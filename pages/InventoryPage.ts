import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;
  readonly inventoryItems: Locator;
  readonly priceLabels: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortSelect = page.locator('[data-test="product_sort_container"]');
    this.inventoryItems = page.locator(".inventory_item");
    this.priceLabels = page.locator(".inventory_item_price");
  }

  async goto() {
    await this.page.goto("/inventory.html");
  }

  async addProductToCart(name: string) {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator("button").click();
  }

  async removeProductFromInventory(name: string) {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator("button").click();
  }

  async openProductDetail(name: string) {
    await this.page
      .locator(".inventory_item_name", { hasText: name })
      .click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async selectSort(value: "az" | "za" | "lohi" | "hilo") {
    await this.sortSelect.selectOption(value);
  }

  async getAllPrices(): Promise<number[]> {
    const pricesText = await this.priceLabels.allTextContents();
    return pricesText.map((p) => {
      const num = p.replace(/[^0-9.]/g, "");
      return Number(num);
    });
  }

  async getProductCard(name: string) {
    return this.inventoryItems.filter({ hasText: name });
  }
}
