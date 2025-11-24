import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.sortSelect = page.locator('[data-test="product_sort_container"]');
  }

  async addProduct(name: string) {
    const id = name.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="add-to-cart-${id}"]`).click();
  }

  async removeProduct(name: string) {
    const id = name.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="remove-${id}"]`).click();
  }

  async sort(option: 'lohi' | 'hilo' | 'az' | 'za') {
    await this.sortSelect.selectOption(option);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allInnerTexts();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async getNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allInnerTexts();
  }

  // Check ảnh lỗi (Problem User requirement)
  async checkImagesLoaded(): Promise<boolean> {
    const images = await this.page.locator('.inventory_item_img img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      // SauceDemo quy ước ảnh lỗi sẽ dùng link này
      if (src?.includes('sl-404') || src?.includes('garbage')) return false;
      
      // Hoặc check naturalWidth
      const width = await img.evaluate((node: HTMLImageElement) => node.naturalWidth);
      if (width === 0) return false;
    }
    return true;
  }
}