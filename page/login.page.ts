import { Page, expect } from '@playwright/test';
import { BasePage } from '../page/base.page';

export class LoginPage extends BasePage {
private usernameInput = this.page.locator('#user-name');
private passwordInput = this.page.locator('#password');
private loginButton = this.page.locator('#login-button');
private errorMessage = this.page.locator('[data-test="error"]');


async login(username: string, password: string) {
await this.usernameInput.fill(username);
await this.passwordInput.fill(password);
await this.loginButton.click();
}


async expectErrorContains(text: string) {
await expect(this.errorMessage).toBeVisible();
await expect(this.errorMessage).toContainText(text);
}
}