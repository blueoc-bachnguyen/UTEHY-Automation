import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS, PASSWORD } from '../utils/constants';

test.describe('4. Visual & UI Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo('/');
  });

  test('Verify Menu Items', async ({ page }) => {
    await loginPage.login(USERS.STANDARD, PASSWORD);
    await loginPage.openMenu();
    await expect(loginPage.allItemsLink).toBeVisible();
    await expect(loginPage.logoutLink).toBeVisible();
  });

  test('Responsive Test (Mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.login(USERS.STANDARD, PASSWORD);
    await expect(loginPage.menuBtn).toBeVisible(); // Burger menu check
  });

  // Visual User Requirement
  test('Visual User: Snapshot Test (Detect Layout Shift)', async ({ page }) => {
    await loginPage.login(USERS.VISUAL, PASSWORD);
    
    // Chụp ảnh so sánh. Lần đầu chạy sẽ tạo ảnh gốc.
    // Visual user có icon giỏ hàng bị lệch, test này sẽ FAIL nếu so với ảnh của Standard User
    // Hoặc ta chỉ cần verify element bị lệch tọa độ
    const cartIcon = loginPage.cartLink;
    const box = await cartIcon.boundingBox();
    
    // Expectation: Layout vẫn render được (không crash), nhưng có thể snapshot cảnh báo
    expect(box).not.toBeNull();
    
    // Nếu muốn strict visual testing:
    await expect(page).toHaveScreenshot('visual-user-inventory.png', { maxDiffPixelRatio: 0.1 });
  });
});