import { test, expect } from "@playwright/test";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { login } from "../utils/helpers";

test("Complete checkout with valid info", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { waitUntil: "domcontentloaded" });
  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");
  await page.click("#login-button");

  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await products.addProduct(0);
  await products.addProduct(1);

  await cart.goToCart();
  await page.click("#checkout");

  await checkout.fillCheckout("Linh", "Test", "12345");
  await checkout.finishBtn.click();

  await expect(checkout.completeHeader).toHaveText("Thank you for your order!");
});

test("Missing postal code shows error", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { waitUntil: "domcontentloaded" });
  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");
  await page.click("#login-button");

  await page.click("button:has-text('Add to cart')");
  await page.click(".shopping_cart_link");
  await page.click("#checkout");

  await page.fill("#first-name", "Linh");
  await page.fill("#last-name", "Test");
  await page.click("#continue");

  await expect(page.locator("[data-test='error']")).toContainText("Postal Code is required");
});

test("Verify total price calculation", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { waitUntil: "domcontentloaded" });
  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");
  await page.click("#login-button");

  await page.locator("button:has-text('Add to cart')").nth(0).click();
  await page.locator("button:has-text('Add to cart')").nth(1).click();

  await page.click(".shopping_cart_link");
  await page.click("#checkout");

  await page.fill("#first-name", "Linh");
  await page.fill("#last-name", "Test");
  await page.fill("#postal-code", "12345");
  await page.click("#continue");

  const prices = await page.$$eval(".inventory_item_price",
    els => els.map(e => parseFloat(e.textContent.replace("$","")))
  );

  const expectedSubtotal = prices.reduce((a,b)=>a+b,0);

  const displayedSubtotal = parseFloat(
    (await page.locator(".summary_subtotal_label").innerText()).replace("Item total: $","")
  );

  expect(displayedSubtotal).toBe(expectedSubtotal);
});

test("Validate tax calculation", async ({ page }) => {
  await login(page);
  await page.locator("button:has-text('Add to cart')").first().click();
  await page.click(".shopping_cart_link");
  await page.click("#checkout");
  await page.fill("#first-name", "Test");
  await page.fill("#last-name", "User");
  await page.fill("#postal-code", "12345");
  await page.click("#continue");
  await page.waitForSelector(".summary_subtotal_label", { timeout: 10000 });

  const subtotal = parseFloat(
    (await page.locator(".summary_subtotal_label").innerText()).replace(
      "Item total: $",
      ""
    )
  );

  const tax = parseFloat(
    (await page.locator(".summary_tax_label").innerText()).replace(
      "Tax: $",
      ""
    )
  );

  expect(tax).toBeCloseTo(subtotal * 0.08, 2);
});


test("Cancel checkout keeps cart items", async ({ page }) => {
  await login(page);

  await page.locator("button:has-text('Add to cart')").first().click();
  await page.click(".shopping_cart_link");
  await page.click("#checkout");

  await page.click("#cancel");

  await expect(page).toHaveURL(/cart/);

  const count = await page.locator(".cart_item").count();
  expect(count).toBe(1);
});
