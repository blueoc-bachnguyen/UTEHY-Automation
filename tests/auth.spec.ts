import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", { waitUntil: "domcontentloaded" });
});

test("Valid login with standard user", async ({ page }) => {
  const login = new LoginPage(page);
  await login.login("standard_user", "secret_sauce");
  await expect(page).toHaveURL(/inventory/);
});

test("Invalid login (wrong password)", async ({ page }) => {
  const login = new LoginPage(page);
  await login.login("standard_user", "wrong_pass");
  await expect(login.errorMsg).toBeVisible();
});

test("Locked out user", async ({ page }) => {
  const login = new LoginPage(page);
  await login.login("locked_out_user", "secret_sauce");
  await expect(login.errorMsg).toContainText("locked out");
});

test("Logout redirects to login", async ({ page }) => {
  const login = new LoginPage(page);
  await login.login("standard_user", "secret_sauce");

  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#logout_sidebar_link").waitFor({ state: "visible" });
  await page.locator("#logout_sidebar_link").click();

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});

test("Session persists after reload", async ({ page }) => {
  const login = new LoginPage(page);
  await login.login("standard_user", "secret_sauce");

  await page.reload();
  await expect(page).toHaveURL(/inventory/);
});
