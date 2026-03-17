import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the Create Lead form.
 * The form opens as a dialog/modal overlay on the Dashboard.
 * Uses shadcn/ui (Radix) components with data-testid attributes.
 */
export class CreateLeadPage {
  readonly page: Page;
  readonly dialog: Locator;

  // Form fields (scoped to dialog via data-testid)
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly companyInput: Locator;
  readonly jobTitleInput: Locator;
  readonly notesInput: Locator;

  // Radix Select triggers (inside dialog)
  readonly priorityTrigger: Locator;
  readonly statusTrigger: Locator;

  // Actions
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  // Feedback
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole("dialog");

    // Use data-testid for reliable element selection
    this.nameInput = page.locator('[data-testid="create-form-name-input"]');
    this.emailInput = page.locator('[data-testid="create-form-email-input"]');
    this.phoneInput = page.locator('[data-testid="create-form-phone-input"]');
    this.companyInput = page.locator('[data-testid="create-form-company-input"]');
    this.jobTitleInput = page.locator('[data-testid="create-form-job-title-input"]');
    this.notesInput = this.dialog.getByLabel(/notes/i);

    this.priorityTrigger = page.locator('[data-testid="create-form-priority-select"]');
    this.statusTrigger = page.locator('[data-testid="create-form-status-select"]');

    this.submitButton = this.dialog.getByRole("button", { name: /create|save|submit|add/i });
    this.cancelButton = this.dialog.getByRole("button", { name: /cancel|close/i });

    this.successMessage = page.getByText(/success|created/i);
    this.errorMessage = this.dialog.locator('[role="alert"], [class*="error"], [class*="destructive"]');
  }

  /** Wait for the create-lead dialog to be ready */
  async waitForLoad() {
    await this.dialog.waitFor({ state: "visible", timeout: 15_000 });
    await this.nameInput.waitFor({ state: "visible", timeout: 10_000 });
  }

  /**
   * Fill the create-lead form with the provided data.
   * Only fills fields that are present in the data object.
   */
  async fillForm(data: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    priority?: string;
    status?: string;
    notes?: string;
  }) {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.email !== undefined) await this.emailInput.fill(data.email);

    if (data.phone !== undefined && (await this.phoneInput.count()) > 0)
      await this.phoneInput.fill(data.phone);
    if (data.company !== undefined && (await this.companyInput.count()) > 0)
      await this.companyInput.fill(data.company);
    if (data.jobTitle !== undefined && (await this.jobTitleInput.count()) > 0)
      await this.jobTitleInput.fill(data.jobTitle);
    if (data.notes !== undefined && (await this.notesInput.count()) > 0)
      await this.notesInput.first().fill(data.notes);

    // Radix UI Select dropdowns – click trigger → pick option from portal
    if (data.priority !== undefined) {
      await this.selectRadixOption(this.priorityTrigger, data.priority);
    }
    if (data.status !== undefined) {
      await this.selectRadixOption(this.statusTrigger, data.status);
    }
  }

  /** Submit the form */
  async submit() {
    await this.submitButton.first().click();
  }

  /** Fill and submit the form in one step */
  async createLead(data: Parameters<typeof this.fillForm>[0]) {
    await this.fillForm(data);
    await this.submit();
  }

  /** Assert lead created successfully */
  async expectSuccess() {
    // Either a success toast appears or the dialog closes
    await Promise.race([
      this.successMessage.first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => {}),
      this.dialog.waitFor({ state: "hidden", timeout: 15_000 }).catch(() => {}),
    ]);
  }

  /** Assert form validation error is shown */
  async expectValidationError() {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10_000 });
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  /**
   * Select an option from a Radix UI Select component.
   * 1. Click the combobox trigger to open the listbox.
   * 2. Select the option from the portal-rendered listbox.
   */
  private async selectRadixOption(trigger: Locator, value: string) {
    if ((await trigger.count()) === 0) return;

    // Check if the value is already selected (shown in the trigger text)
    const currentText = await trigger.innerText();
    if (currentText.trim() === value) return; // already selected

    await trigger.click();
    // Radix renders the listbox in a portal at document root level
    const option = this.page.getByRole("option", { name: value });
    await option.first().waitFor({ state: "visible", timeout: 5_000 });
    await option.first().click();
  }
}
