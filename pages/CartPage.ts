import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  cartItems = this.page.locator(".cart_item");
  checkoutBtn = this.page.locator("#checkout");

  async goToCart() {
    await this.page.click(".shopping_cart_link");
  }

  async getCartCount() {
    return await this.cartItems.count();
  }
}
