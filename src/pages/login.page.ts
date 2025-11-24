import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class LoginPage extends BasePage {
  private username: Locator;
  private password: Locator;
  private loginBtn: Locator;
  private errorMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.locator('#user-name');
    this.password = page.locator('#password');
    this.loginBtn = page.locator('#login-button');
    this.errorMsg = page.locator('[data-test="error"]');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }

  async expecErrorContains(text: string) {
    await expect(this.errorMsg).toBeVisible();
    await expect(this.errorMsg).toContainText(text);
  }
}
