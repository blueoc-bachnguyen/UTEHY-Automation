import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

test.describe("Authentication", () => {
  test("Valid login with standard user", async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login("standard_user", "secret_sauce");

    await expect(inventory.title).toHaveText("Products");
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test("Invalid login (wrong username/password)", async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login("standard_user", "wrong_pass");

    await expect(login.errorMessage).toBeVisible();
  });

  test("Locked-out user scenario", async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login("locked_out_user", "secret_sauce");

    await expect(login.errorMessage).toContainText("locked out");
  });

  test("Logout test (verify redirect to login page)", async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login("standard_user", "secret_sauce");
    await expect(inventory.title).toHaveText("Products");

    await page.click("#react-burger-menu-btn");
    await page.click("#logout_sidebar_link");

    await expect(page).toHaveURL("/");
    await expect(login.usernameInput).toBeVisible();
  });

  test("Session persistence after page reload", async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login("standard_user", "secret_sauce");

    await page.goto(page.url(), { waitUntil: "domcontentloaded" });
    
    await expect(inventory.title).toHaveText("Products");
  });
});
