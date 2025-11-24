import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PASSWORD, MESSAGES, URLS } from '../utils/constants';

test.describe('3. Checkout Flow', () => {
  let checkoutPage: CheckoutPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.navigateTo('/');
    await loginPage.login(USERS.STANDARD, PASSWORD);
  });

  test('Checkout Happy Path with Tax Calc', async ({ page }) => {
    await productsPage.addProduct('Sauce Labs Backpack');     // 29.99
    await productsPage.addProduct('Sauce Labs Bike Light');   // 9.99
    await productsPage.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.fillInfo('User', 'Test', '12345');

    const sub = await checkoutPage.getSubTotal(); // 39.98
    const tax = await checkoutPage.getTax();      // ~3.20 (8%)
    const total = await checkoutPage.getTotal();
    
    // Validate Math
    expect(sub).toBe(39.98);
    expect(Math.abs((sub + tax) - total)).toBeLessThan(0.01);

    await checkoutPage.finishBtn.click();
    await expect(checkoutPage.completeHeader).toHaveText(MESSAGES.SUCCESS_ORDER);
  });

  test('Checkout with Empty Cart (Block/Validate)', async ({ page }) => {
    // Req: Attempt checkout with empty cart
    await productsPage.cartLink.click();
    // Web này cho phép bấm checkout khi rỗng, nhưng không có item nào
    await cartPage.checkout(); 
    
    // Verify đang ở step one
    await expect(page).toHaveURL(URLS.CHECKOUT_ONE);
    
    // Verify không có item nào trong danh sách (dù site cho phép đi tiếp)
    // Nếu site chặn nút checkout, dùng expect(cartPage.checkoutBtn).toBeDisabled();
    await checkoutPage.cancelBtn.click();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('Negative: Missing Fields', async () => {
    await productsPage.addProduct('Sauce Labs Backpack');
    await productsPage.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.continueBtn.click(); // Click mà không điền
    expect(await checkoutPage.errorMsg.innerText()).toContain(MESSAGES.MISSING_NAME);
  });

  test('Cancel Checkout preserves cart', async ({ page }) => {
    await productsPage.addProduct('Sauce Labs Backpack');
    await productsPage.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.cancelBtn.click();
    await expect(page).toHaveURL(URLS.CART);
    expect(await productsPage.getCartBadgeCount()).toBe(1);
  });

  // Error User Requirement
  test('Error User: Fails to finish checkout', async ({ page }) => {
    const login = new LoginPage(page);
    await login.logout(); 
    await login.login(USERS.ERROR, PASSWORD); // Re-login as Error User

    await productsPage.addProduct('Sauce Labs Backpack');
    await productsPage.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.fillInfo('Error', 'User', '000');
    
    await checkoutPage.finishBtn.click();
    // Error User thường không hoàn thành được đơn hàng hoặc không redirect
    // Expect: Không thấy message thành công
    await expect(page).not.toHaveURL(URLS.FINISH);
  });
});