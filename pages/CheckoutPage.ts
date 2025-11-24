import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstInp: Locator;
  readonly lastInp: Locator;
  readonly zipInp: Locator;
  readonly continueBtn: Locator;
  readonly finishBtn: Locator;
  readonly cancelBtn: Locator;
  readonly errorMsg: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstInp = page.locator('[data-test="firstName"]');
    this.lastInp = page.locator('[data-test="lastName"]');
    this.zipInp = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.finishBtn = page.locator('[data-test="finish"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
    this.errorMsg = page.locator('[data-test="error"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillInfo(f: string, l: string, z: string) {
    await this.firstInp.fill(f);
    await this.lastInp.fill(l);
    await this.zipInp.fill(z);
    await this.continueBtn.click();
  }

  async getSubTotal() {
    const t = await this.page.locator('.summary_subtotal_label').innerText();
    return parseFloat(t.replace('Item total: $', ''));
  }
  async getTax() {
    const t = await this.page.locator('.summary_tax_label').innerText();
    return parseFloat(t.replace('Tax: $', ''));
  }
  async getTotal() {
    const t = await this.page.locator('.summary_total_label').innerText();
    return parseFloat(t.replace('Total: $', ''));
  }
}