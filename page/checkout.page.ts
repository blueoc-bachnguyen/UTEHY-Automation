import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
private firstName = this.page.locator('[data-test="firstName"]');
private lastName = this.page.locator('[data-test="lastName"]');
private postalCode = this.page.locator('[data-test="postalCode"]');
private continueBtn = this.page.locator('[data-test="continue"]');
private finishBtn = this.page.locator('[data-test="finish"]');


async fillCustomer(first: string, last: string, postal: string) {
await this.firstName.fill(first);
await this.lastName.fill(last);
await this.postalCode.fill(postal);
}


async continue() {
await this.continueBtn.click();
}


async finish() {
await this.finishBtn.click();
}
}