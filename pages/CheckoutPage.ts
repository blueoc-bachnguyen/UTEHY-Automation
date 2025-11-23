import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class CheckoutPage extends BasePage {
  firstName = this.page.locator("#first-name");
  lastName = this.page.locator("#last-name");
  postalCode = this.page.locator("#postal-code");
  continueBtn = this.page.locator("#continue");
  finishBtn = this.page.locator("#finish");
  cancelBtn = this.page.locator("#cancel");
  total = this.page.locator(".summary_total_label");
  tax = this.page.locator(".summary_tax_label");
  itemTotal = this.page.locator(".summary_subtotal_label");
  completeHeader = this.page.locator(".complete-header");

  async fillCheckout(first: string, last: string, postal: string) {
    await this.type(this.firstName, first);
    await this.type(this.lastName, last);
    await this.type(this.postalCode, postal);
    await this.click(this.continueBtn);
  }
}
