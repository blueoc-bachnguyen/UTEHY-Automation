import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { Menu } from "../pages/Menu";
import { CartPage } from "../pages/CartPage";

test.describe.configure({ mode: "serial" });

test("Verify menu items visible", async ({ page }) => {
  const login = new LoginPage(page);
  const menu = new Menu(page);

  await login.goto();
  await login.login("standard_user", "secret_sauce");

  await menu.open();

  await expect(menu.allItemsLink).toBeVisible();
  await expect(menu.aboutLink).toBeVisible();
  await expect(menu.logoutLink).toBeVisible();
  await expect(menu.resetAppStateLink).toBeVisible();
});

test("Responsive layout desktop vs mobile", async ({ browser }) => {
  const desktop = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });

  const loginDesktop = new LoginPage(desktop);
  const loginMobile = new LoginPage(mobile);

  await loginDesktop.goto();
  await loginDesktop.login("standard_user", "secret_sauce");

  await loginMobile.goto();
  await loginMobile.login("standard_user", "secret_sauce");

  await expect(new InventoryPage(desktop).title).toBeVisible();
  await expect(new InventoryPage(mobile).title).toBeVisible();

  await desktop.close();
  await mobile.close();
});

test("Checkout button disabled if cart empty", async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.goto();
  await login.login("standard_user", "secret_sauce");

  await inventory.openCart();

  const cart = new CartPage(page);
  await expect(cart.checkoutButton).toBeEnabled();
});

test("Validate image dimensions are consistent", async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.goto();
  await login.login("standard_user", "secret_sauce");

  await page.waitForLoadState("networkidle");

  const images = page.locator(".inventory_item_img img");
  const count = await images.count();

  const sizes: { w: number; h: number }[] = [];

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const size = await img.evaluate((el) => {
      const imgEl = el as HTMLImageElement;
      return { w: imgEl.naturalWidth, h: imgEl.naturalHeight };
    });
    sizes.push(size);
  }

  for (const s of sizes) {
    expect(s.w).toBeGreaterThan(0);
    expect(s.h).toBeGreaterThan(0);
  }
});
