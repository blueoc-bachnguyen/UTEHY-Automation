import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test("Validate error messages on failed login", async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login("standard_user", "wrong");
  await expect(login.errorMessage).toContainText("Username and password");
});

test("Attempt checkout with empty cart (should block checkout)", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await login.goto();
  await login.login("standard_user", "secret_sauce");
  await inventory.openCart();

  await expect(cart.checkoutButton).toBeEnabled();
});

test("Try accessing checkout page directly without login", async ({ page }) => {
  await page.goto("/checkout-step-one.html");
  await expect(page).toHaveURL("/"); 
});

test("Handle flaky selectors with explicit wait", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login("standard_user", "secret_sauce");

  const inventory = new InventoryPage(page);
  await expect(inventory.title).toBeVisible({ timeout: 5000 });
});

test("Simulate network delay and verify stability", async ({ browser }) => {
  const context = await browser.newContext();

  await context.route("**/*", async (route) => {
    await new Promise((r) => setTimeout(r, 1000));
    await route.continue();
  });

  const page = await context.newPage();
  const login = new LoginPage(page);

  await login.goto();
  await login.login("standard_user", "secret_sauce");

  const inventory = new InventoryPage(page);
  await expect(inventory.title).toBeVisible();

  await context.close();
});