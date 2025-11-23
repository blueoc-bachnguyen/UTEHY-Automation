import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage'; 

export class ProductsPage extends BasePage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  async navigate() {
    await this.page.goto('/inventory.html');
    await expect(this.page).toHaveURL('/inventory.html');
  }

  async addProductToCart(productName: string) {
    const productItem = this.page.locator('.inventory_item', { hasText: productName });
    await productItem.locator('button[data-test^="add-to-cart"]').click();
  }

  async removeProductFromCart(productName: string) {
    const productItem = this.page.locator('.inventory_item', { hasText: productName });
    await productItem.locator('button[data-test^="remove"]').click();
  }

  async expectCartBadgeCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(count.toString());
    }
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption({ value: option });
  }

  async verifyProductDetails(productName: string, description: string, price: string) {
    const productItem = this.page.locator('.inventory_item', { hasText: productName });
    await expect(productItem.locator('.inventory_item_desc')).toHaveText(description);
    await expect(productItem.locator('.inventory_item_price')).toHaveText(price);
  }

  async goToProductDetails(productName: string) {
    const productItem = this.page.locator('.inventory_item', { hasText: productName });
    await productItem.locator('.inventory_item_name').click();
  }

  async verifyProductImagesLoaded() {
    const images = await this.page.locator('.inventory_item_img').all();
    for (const img of images) {
      await expect(img).toBeVisible();
      const src = await img.getAttribute('src');
      expect(src).not.toBeNull();
      expect(src).not.toBe('');
    }
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}