import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {

  username = this.page.locator("#user-name");
  password = this.page.locator("#password");
  loginBtn = this.page.locator("#login-button");
  errorMsg = this.page.locator("[data-test='error']");

  async login(user: string, pass: string) {
    await this.type(this.username, user);
    await this.type(this.password, pass);
    await this.click(this.loginBtn);
  }

  async assertLoginError(message: string) {
    await expect(this.errorMsg).toContainText(message);
  }
}
