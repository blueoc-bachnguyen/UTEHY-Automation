import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async navigate() {
    await this.page.goto('/cart.html');
    await expect(this.page).toHaveURL('/cart.html');
  }

  async expectCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectProductInCart(productName: string, quantity: string = '1') {
    const item = this.page.locator('.cart_item', { hasText: productName });
    await expect(item).toBeVisible();
    await expect(item.locator('.cart_quantity')).toHaveText(quantity);
  }

  async removeProductFromCart(productName: string) {
    const item = this.page.locator('.cart_item', { hasText: productName });
    await item.locator('button[data-test^="remove"]').click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}