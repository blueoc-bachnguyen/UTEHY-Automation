import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly summaryTotal: Locator;
  readonly summaryTax: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryTotal = page.locator(".summary_total_label");
    this.summaryTax = page.locator(".summary_tax_label");
    this.completeHeader = page.locator(".complete-header");
  }

  async fillUserInfo(first: string, last: string, postal: string) {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(postal);
  }

  async continue() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}
