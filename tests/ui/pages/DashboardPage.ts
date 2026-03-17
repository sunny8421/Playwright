import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the Dashboard / Lead List page.
 * Displayed after successful login – shows a paginated list of leads.
 */
export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createLeadButton: Locator;
  readonly leadTable: Locator;
  readonly leadRows: Locator;
  readonly searchInput: Locator;
  readonly noLeadsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /leads|dashboard/i });
    this.createLeadButton = page.getByRole("link", { name: /create|add|new/i }).or(
      page.getByRole("button", { name: /create|add|new/i })
    );
    this.leadTable = page.locator("table").or(page.locator('[class*="lead"]'));
    this.leadRows = page.locator("table tbody tr").or(page.locator('[class*="lead-row"], [class*="card"]'));
    this.searchInput = page.getByPlaceholder(/search/i);
    this.noLeadsMessage = page.getByText(/no leads/i);
  }

  /** Wait for the dashboard to be fully loaded */
  async waitForLoad() {
    // Wait for either the heading or lead rows to appear
    await this.page.waitForLoadState("networkidle", { timeout: 15_000 });
  }

  /** Click the "Create Lead" / "Add Lead" button */
  async clickCreateLead() {
    await this.createLeadButton.first().click();
  }

  /** Assert that a lead with the given name is visible in the list */
  async expectLeadVisible(leadName: string) {
    const leadCell = this.page.getByText(leadName, { exact: false });
    await expect(leadCell.first()).toBeVisible({ timeout: 15_000 });
  }

  /** Assert that a lead with the given email is visible in the list */
  async expectLeadEmailVisible(email: string) {
    const emailCell = this.page.getByText(email, { exact: false });
    await expect(emailCell.first()).toBeVisible({ timeout: 15_000 });
  }

  /** Get count of visible lead rows */
  async getLeadCount(): Promise<number> {
    return await this.leadRows.count();
  }
}
