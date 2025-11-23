import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class ProductsPage extends BasePage {
  productItems = this.page.locator(".inventory_item");
  addToCartButtons = this.page.locator("button:has-text('Add to cart')");
  removeButtons = this.page.locator("button:has-text('Remove')");
  cartBadge = this.page.locator(".shopping_cart_badge");
  sortDropdown = this.page.locator("[data-test='product_sort_container']");

  async addProduct(index: number) {
    const btn = this.addToCartButtons.nth(index);
    await btn.scrollIntoViewIfNeeded();
    await btn.waitFor({ state: "visible" });
    await btn.click();
  }

  async removeProduct(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async getProductDetails(index: number) {
    const item = this.productItems.nth(index);
    return {
      name: await item.locator(".inventory_item_name").innerText(),
      description: await item.locator(".inventory_item_desc").innerText(),
      price: await item.locator(".inventory_item_price").innerText(),
      img: await item.locator("img").getAttribute("src")
    };
  }

  async sort(option: string) {
    await this.page.waitForSelector("[data-test='product_sort_container']", {
      timeout: 15000
    });
    await this.sortDropdown.waitFor({ state: "visible" });
    await this.sortDropdown.selectOption(option);
  }
}
