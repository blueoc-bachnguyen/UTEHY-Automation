import { Page, Locator } from "@playwright/test";

export class BasePage {
  constructor(public page: Page) {}

  async click(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async type(locator: Locator, text: string) {
    await locator.waitFor({ state: "visible" });
    await locator.fill(text);
  }
}
