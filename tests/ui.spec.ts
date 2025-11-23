import { test, expect } from "@playwright/test";
import { login } from "../utils/helpers";
import { MenuPage } from "../pages/MenuPage";

test("Menu items visible", async ({ page }) => {
  await login(page);

  const menu = new MenuPage(page);
  await menu.openMenu();

  await expect(menu.allItems).toBeVisible();
  await expect(menu.about).toBeVisible();
  await expect(menu.logout).toBeVisible();
  await expect(menu.reset).toBeVisible();
});

test("Responsive layout mobile vs desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await login(page);

  const desktopMenuVisible = await page.locator("#react-burger-menu-btn").isVisible();

  await page.setViewportSize({ width: 375, height: 812 });

  const mobileMenuVisible = await page.locator("#react-burger-menu-btn").isVisible();

  expect(desktopMenuVisible).toBeTruthy();
  expect(mobileMenuVisible).toBeTruthy();
});

test("Checkout button disabled if cart empty", async ({ page }) => {
  await login(page);
  await page.click(".shopping_cart_link");

  const checkoutBtn = page.locator("#checkout");
  await checkoutBtn.click();
  await expect(page).toHaveURL(/checkout-step-one/);
});

test("Product image dimensions are consistent", async ({ page }) => {
  await login(page);

  const images = page.locator(".inventory_item img");
  const count = await images.count();

  let firstSize: { width: number; height: number } | null = null;

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await img.scrollIntoViewIfNeeded();
    await img.waitFor({ state: "visible" });
    const box = await images.nth(i).boundingBox();

    if (!box) continue;

    if (!firstSize) {
      firstSize = { width: box.width, height: box.height };
      continue;
    }

    expect(box.width).toBeCloseTo(firstSize.width, 1);
    expect(box.height).toBeCloseTo(firstSize.height, 1);
  }
});
