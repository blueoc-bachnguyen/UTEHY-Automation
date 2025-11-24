import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly userInp: Locator;
  readonly passInp: Locator;
  readonly loginBtn: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.userInp = page.locator('[data-test="username"]');
    this.passInp = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-button"]');
    this.errorMsg = page.locator('[data-test="error"]');
  }

  async login(u: string, p: string) {
    await this.userInp.fill(u);
    await this.passInp.fill(p);
    await this.loginBtn.click();
  }
}