import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly menuBtn: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly resetLink: Locator;
  readonly aboutLink: Locator;
  readonly allItemsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuBtn = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.resetLink = page.locator('#reset_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
  }

  async openMenu() { await this.menuBtn.click(); }
  
  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.innerText());
    }
    return 0;
  }

  async navigateTo(path: string) { await this.page.goto(path); }
}