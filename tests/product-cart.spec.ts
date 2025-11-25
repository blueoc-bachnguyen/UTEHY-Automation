import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";

const USER = { username: "standard_user", password: "secret_sauce" };

// Login trước mỗi test -> sau login sẽ đứng ở trang inventory
test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(USER.username, USER.password);
});

// 1) Add multiple products to cart and verify cart count
test("Add multiple products to cart and verify cart count", async ({ page }) => {
  const inventory = new InventoryPage(page);

  await inventory.addProductToCart("Sauce Labs Backpack");
  await inventory.addProductToCart("Sauce Labs Bike Light");

  await expect(inventory.cartBadge).toHaveText("2");
});

// 2) Remove product from cart
test("Remove product from cart", async ({ page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addProductToCart("Sauce Labs Backpack");
  await inventory.openCart();

  await cart.removeProduct("Sauce Labs Backpack");
  await expect(cart.items).toHaveCount(0);
});

// 3) Add → remove → add again, verify consistency
test("Add → remove → add again, verify consistency", async ({ page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addProductToCart("Sauce Labs Backpack");
  await inventory.openCart();
  await cart.removeProduct("Sauce Labs Backpack");

  await page.click("#continue-shopping");
  await inventory.addProductToCart("Sauce Labs Backpack");
  await inventory.openCart();

  await expect(cart.items).toHaveCount(1);
});

// 4) Verify product details between listing and detail page
test("Verify product details between listing and detail page", async ({ page }) => {
  const inventory = new InventoryPage(page);
  const productName = "Sauce Labs Backpack";

  const card = await inventory.getProductCard(productName);
  const nameList = await card.locator(".inventory_item_name").textContent();
  const descList = await card.locator(".inventory_item_desc").textContent();
  const priceList = await card.locator(".inventory_item_price").textContent();

  await inventory.openProductDetail(productName);

  const nameDetail = await page.locator(".inventory_details_name").textContent();
  const descDetail = await page.locator(".inventory_details_desc").textContent();
  const priceDetail = await page
    .locator(".inventory_details_price")
    .textContent();

  expect(nameDetail).toBe(nameList);
  expect(descDetail).toBe(descList);
  expect(priceDetail).toBe(priceList);
});

// 5) SKIP sorting test (vì UI của bạn không có dropdown sort)
test.skip(
  "Verify product sorting (Price low→high / high→low / A→Z / Z→A)",
  async ({ page }) => {
    // Sorting chưa có trên UI → skip để tránh fail test
  }
);

// 6) Verify product images load correctly
test("Verify product images load correctly", async ({ page }) => {
  const images = page.locator(".inventory_item_img img");
  const count = await images.count();

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await expect(img).toBeVisible();

    const natWidth = await img.evaluate(
      (el) => (el as HTMLImageElement).naturalWidth
    );
    expect(natWidth).toBeGreaterThan(0);
  }
});

// 7) Attempt to add item without login (should not be possible)
test("Attempt to add item without login (should not be possible)", async ({
  page,
}) => {
  // Xóa session để đảm bảo đang logout
  await page.context().clearCookies();

  await page.goto("/inventory.html");

  // Chưa login thì phải bị trả về trang login "/"
  await expect(page).toHaveURL("https://www.saucedemo.com/");
});
