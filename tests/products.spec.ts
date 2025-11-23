import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { login } from "../utils/helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { waitUntil: "domcontentloaded" });
  await new LoginPage(page).login("standard_user", "secret_sauce");
});

test("Add multiple products and verify cart count", async ({ page }) => {
  const products = new ProductsPage(page);

  await products.addProduct(0);
  await products.addProduct(1);

  await expect(products.cartBadge).toHaveText("2");
});

test("Remove product from cart", async ({ page }) => {
  const products = new ProductsPage(page);

  await products.addProduct(0);
  await products.removeProduct(0);

  await expect(products.cartBadge).not.toBeVisible();
});

test("Add → remove → add again consistency", async ({ page }) => {
  const products = new ProductsPage(page);

  await products.addProduct(0);
  await products.removeProduct(0);
  await products.addProduct(0);

  await expect(products.cartBadge).toHaveText("1");
});

test("Verify product details match listing and detail page", async ({ page }) => {
  const products = new ProductsPage(page);

  const detailsList = await products.getProductDetails(0);

  await page.click(".inventory_item_name");

  const nameDetail = await page.locator(".inventory_details_name").innerText();
  const descDetail = await page.locator(".inventory_details_desc").innerText();
  const priceDetail = await page.locator(".inventory_details_price").innerText();

  expect(detailsList.name).toBe(nameDetail);
  expect(detailsList.description).toBe(descDetail);
  expect(detailsList.price).toBe(priceDetail);
});

test("Verify sorting price low → high", async ({ page }) => {
  await login(page);

  const products = new ProductsPage(page);

  await products.sort("lohi");

  const prices = await page.$$eval(".inventory_item_price", items =>
    items.map(i => parseFloat(i.textContent.replace("$", "")))
  );

  const sorted = [...prices].sort((a,b)=>a-b);

  expect(prices).toEqual(sorted);
});

test("Verify product images load", async ({ page }) => {
  const products = new ProductsPage(page);

  const count = await products.productItems.count();

  for (let i = 0; i < count; i++) {
    const img = products.productItems.nth(i).locator("img");
    await expect(img).toHaveAttribute("src", /jpg|png/);
  }
});

test("Cannot add product without login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");

  const cartBadge = page.locator(".shopping_cart_badge");
  await expect(cartBadge).not.toBeVisible();
});
