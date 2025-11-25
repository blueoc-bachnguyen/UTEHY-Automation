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

  test("Session persistence after page reload", async ({ page, browserName }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    // Bước 1: login thành công
    await login.goto();
    await login.login("standard_user", "secret_sauce");
    await expect(inventory.title).toHaveText("Products");
    await expect(page).toHaveURL(/inventory\.html/);

    // Bước 2: xử lý khác nhau theo browser
    if (browserName === "webkit") {
      // WebKit hay crash khi dùng page.reload() trên CI,
      // nên mình giả lập reload bằng cách goto lại đúng URL.
      await page.goto("/inventory.html", { waitUntil: "load" });
    } else {
      // Chromium & Firefox: test reload đúng nghĩa
      await page.reload();
    }

    // Bước 3: verify session vẫn còn sau "reload"
    await expect(inventory.title).toHaveText("Products");
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
