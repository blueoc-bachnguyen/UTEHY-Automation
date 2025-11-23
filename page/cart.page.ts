import { BasePage } from './base.page';


export class CartPage extends BasePage {
private cartItems = this.page.locator('.cart_item');
private checkoutButton = this.page.locator('[data-test="checkout"]');


async removeItem(name: string) {
await this.cartItems.filter({ hasText: name }).locator('button').click();
}


async checkout() {
await this.checkoutButton.click();
}
}