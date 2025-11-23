import { BasePage } from "./BasePage";

export class MenuPage extends BasePage {
  menuBtn = this.page.locator("#react-burger-menu-btn");
  allItems = this.page.locator("#inventory_sidebar_link");
  about = this.page.locator("#about_sidebar_link");
  logout = this.page.locator("#logout_sidebar_link");
  reset = this.page.locator("#reset_sidebar_link");

  async openMenu() {
    await this.menuBtn.click();
  }
}
