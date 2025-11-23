import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly page: Page;
  // Step One
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  // Step Two
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly taxTotal: Locator;
  readonly totalAmount: Locator;
  // Complete
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    // Step One
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    // Step Two
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.taxTotal = page.locator('.summary_tax_label');
    this.totalAmount = page.locator('.summary_total_label');
    // Complete
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async navigateToCheckoutStepOne() {
    await this.page.goto('/checkout-step-one.html');
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async expectErrorMessage(message: string) {
    const errorMessageLocator = this.page.locator('[data-test="error"]');
    await expect(errorMessageLocator).toHaveText(message);
  }

  async verifyOrderSummary(expectedItemTotal: number, expectedTax: number) {
    const itemTotalText = await this.itemTotal.innerText();
    const taxTotalText = await this.taxTotal.innerText();
    const totalAmountText = await this.totalAmount.innerText();
    const actualItemTotal = parseFloat(itemTotalText.replace('Item total: $', ''));
    const actualTax = parseFloat(taxTotalText.replace('Tax: $', ''));
    const actualTotal = parseFloat(totalAmountText.replace('Total: $', ''));

    expect(actualItemTotal).toBeCloseTo(expectedItemTotal, 2);
    expect(actualTax).toBeCloseTo(expectedTax, 2);
    expect(actualTotal).toBeCloseTo(actualItemTotal + actualTax, 2);
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async expectCheckoutComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}