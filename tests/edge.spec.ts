import { test, expect } from "@playwright/test";
import { login } from "../utils/helpers";
import { clickWithRetry } from "../utils/wait";

test("Handle flaky add to cart button", async ({ page }) => {
  await login(page);

  const btn = page.locator("button:has-text('Add to cart')").first();

  await clickWithRetry(btn);

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});

test("Checkout error message when missing info", async ({ page }) => {
  await login(page);

  await page.click(".shopping_cart_link");
  await page.click("#checkout");
  await page.click("#continue");

  await expect(page.locator("[data-test='error']")).toContainText(
    "First Name is required"
  );
});

test("Checkout blocked when cart empty", async ({ page }) => {
  await login(page);

  await page.click(".shopping_cart_link");

  await page.click("#checkout");
  await expect(page).toHaveURL(/checkout-step-one/);
});

test("Redirect to login when accessing checkout without login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/checkout-step-one.html");

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});

test("App stable under network delay", async ({ page }) => {
  await page.route("**/*", async route => {
    await new Promise(res => setTimeout(res, 1000));
    await route.continue();
  });

  await login(page);

  await expect(page.locator(".inventory_list")).toBeVisible();
});

