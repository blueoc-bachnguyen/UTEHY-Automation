import { Page, expect, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly appLogo: Locator;
  readonly shoppingCartLink: Locator;
  readonly menuButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly sidebarCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLogo = page.locator('.app_logo');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.sidebarCloseButton = page.locator('#react-burger-cross-btn');
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.allItemsLink).toBeVisible(); 
  }

  async closeMenu() {
    await this.sidebarCloseButton.click();
    await expect(this.allItemsLink).not.toBeVisible();
  }

  async clickAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
    await expect(this.page).toHaveURL('/inventory.html');
  }

  async clickAbout() {
    await this.openMenu();
    await this.aboutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.goBack();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('/');
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetAppStateLink.click();
    await this.closeMenu();
    await expect(this.page.locator('.shopping_cart_badge')).not.toBeVisible();
  }

  async expectMenuItemsVisible() {
    await this.openMenu();
    await expect(this.allItemsLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    await expect(this.resetAppStateLink).toBeVisible();
    await this.closeMenu();
  }

  async expectShoppingCartLinkVisible() {
    await expect(this.shoppingCartLink).toBeVisible();
  }

  async expectAppLogoVisible() {
    await expect(this.appLogo).toBeVisible();
  }
}