import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly checkoutBtn: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutBtn = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
  }

  async checkout() { await this.checkoutBtn.click(); }
}