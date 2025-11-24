import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class CheckOutPage extends BasePage {
  private firstName: Locator;
  private lastName: Locator;
  private postalCode: Locator;
  private continueBtn: Locator;
  private cancelBtn: Locator;
  private errorMsg: Locator;

  private itemTotalLabel: Locator;
  private taxLabel: Locator;
  private totalLabel: Locator;
  private finishBtn: Locator;

  private completeHeader: Locator;
  private completeText: Locator;

  constructor(page: Page) {
    super(page);

    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
    this.errorMsg = page.locator('[data-test="error"]');

    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishBtn = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
  }

  async fillCustomer(first: string, last: string, postal: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
  }

  async continueCheckout() {
    await this.continueBtn.click();
  }

  async cancelCheckout() {
    await this.cancelBtn.click();
  }

  async getErrorMessage() {
    return this.errorMsg.textContent();
  }

  async getItemTotal(): Promise<number> {
    const text = await this.itemTotalLabel.innerText();
    return parseFloat(text.replace('Item total: $', ''));
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.innerText();
    return parseFloat(text.replace('Tax: $', ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.innerText();
    return parseFloat(text.replace('Total: $', ''));
  }

  async finishCheckout() {
    await this.finishBtn.click();
  }

  async isOrderCompleted() {
    return this.completeHeader.isVisible();
  }

  async getCompletionMessage() {
    return this.completeHeader.textContent();
  }
}