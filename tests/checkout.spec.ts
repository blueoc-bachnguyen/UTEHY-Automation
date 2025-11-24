import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

const USER = { username: "standard_user", password: "secret_sauce" };

async function loginAndAddItems(page: Page) {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.goto();
  await login.login(USER.username, USER.password);

  await inventory.addProductToCart("Sauce Labs Backpack");
  await inventory.addProductToCart("Sauce Labs Bike Light");
  await inventory.openCart();
}


test("Complete checkout process with valid user info", async ({ page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await loginAndAddItems(page);
  await cart.clickCheckout();

  await checkout.fillUserInfo("Nguyen", "Long", "70000");
  await checkout.continue();
  await checkout.finish();

  await expect(checkout.completeHeader).toHaveText("Thank you for your order!");
});

test("Negative case: missing required fields", async ({ page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await loginAndAddItems(page);
  await cart.clickCheckout();

  await checkout.fillUserInfo("Nguyen", "Long", "");
  await checkout.continue();

  await expect(checkout.errorMessage).toBeVisible();
});

test("Checkout with multiple items and verify total price calculation", async ({
  page,
}) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await loginAndAddItems(page);
  await cart.clickCheckout();
  await checkout.fillUserInfo("Nguyen", "Long", "70000");
  await checkout.continue();

  const itemPricesText = await page
    .locator(".inventory_item_price")
    .allTextContents();
  const itemTotal = itemPricesText
    .map((t) => Number(t.replace("$", "")))
    .reduce((a, b) => a + b, 0);

  const totalText = await checkout.summaryTotal.textContent();
  const taxText = await checkout.summaryTax.textContent();

  const totalValue = Number(
    totalText?.replace("Item total: $", "").replace("Total: $", "").split("$").at(-1)
  );
  const taxValue = Number(taxText?.replace("Tax: $", ""));

  expect(Number((itemTotal + taxValue).toFixed(2))).toBe(totalValue);
});

test("Verify order confirmation page and summary", async ({ page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await loginAndAddItems(page);
  await cart.clickCheckout();
  await checkout.fillUserInfo("Nguyen", "Long", "70000");
  await checkout.continue();
  await checkout.finish();

  await expect(checkout.completeHeader).toBeVisible();
  await expect(page.locator(".complete-text")).toBeVisible();
});

test("Cancel checkout and ensure cart remains preserved", async ({ page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await loginAndAddItems(page);
  await cart.clickCheckout();
  await checkout.fillUserInfo("Nguyen", "Long", "70000");
  await checkout.continue();

  await checkout.cancel();

  await expect(page).toHaveURL(/inventory\.html/);
  await page.click('[data-test="shopping-cart-link"]');
  await expect(page).toHaveURL(/cart\.html/);
  await expect(cart.items).toHaveCount(2);
});
