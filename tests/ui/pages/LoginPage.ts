import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the Login page.
 * URL: / (root)
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.signInButton = page.getByRole("button", { name: /sign in/i });
    this.errorMessage = page.locator('[role="alert"], .error, [class*="error"], [class*="destructive"]');
    this.heading = page.getByText("Sign in to your account");
  }

  /** Navigate to the login page */
  async goto() {
    await this.page.goto("/");
    await this.heading.waitFor({ state: "visible", timeout: 15_000 });
  }

  /** Fill in credentials and click Sign In */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /** Assert that login was successful by checking redirect away from login page */
  async expectLoginSuccess() {
    // After successful login the user should be redirected to the dashboard
    await this.page.waitForURL(/.*(?!^\/$)/, { timeout: 15_000 });
    await expect(this.page).not.toHaveURL("/");
  }

  /** Assert that an error message is displayed */
  async expectLoginError(expectedText?: string) {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10_000 });
    if (expectedText) {
      await expect(this.errorMessage.first()).toContainText(expectedText);
    }
  }
}
