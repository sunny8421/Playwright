import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateLeadPage } from "./pages/CreateLeadPage";
import { USERS, generateUniqueLead } from "../fixtures/test-data";

/**
 * UI E2E Test Suite – Login → Create Lead → List Lead
 *
 * This suite automates the core happy-path business flow:
 *   1. Admin user logs in with valid credentials
 *   2. Navigates to the Create Lead form
 *   3. Fills in all required lead details and submits
 *   4. Verifies the newly created lead appears on the dashboard list
 */

test.describe("Lead Management – End-to-End UI Flow", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let createLeadPage: CreateLeadPage;
  const leadData = generateUniqueLead("e2e");

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createLeadPage = new CreateLeadPage(page);
  });

  test("Login → Create Lead → Verify Lead in List", async ({ page }) => {
    // ──────────────────────────────────────────────
    // Step 1: Navigate to login page
    // ──────────────────────────────────────────────
    await test.step("Navigate to Login page", async () => {
      await loginPage.goto();
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
    });

    // ──────────────────────────────────────────────
    // Step 2: Login with valid admin credentials
    // ──────────────────────────────────────────────
    await test.step("Login with admin credentials", async () => {
      await loginPage.login(USERS.admin.email, USERS.admin.password);
      await loginPage.expectLoginSuccess();
    });

    // ──────────────────────────────────────────────
    // Step 3: Dashboard loads and shows leads
    // ──────────────────────────────────────────────
    await test.step("Dashboard loads successfully", async () => {
      await dashboardPage.waitForLoad();
    });

    // ──────────────────────────────────────────────
    // Step 4: Navigate to Create Lead form
    // ──────────────────────────────────────────────
    await test.step("Navigate to Create Lead form", async () => {
      await dashboardPage.clickCreateLead();
      await createLeadPage.waitForLoad();
    });

    // ──────────────────────────────────────────────
    // Step 5: Fill the form and submit
    // ──────────────────────────────────────────────
    await test.step("Fill and submit the Create Lead form", async () => {
      await createLeadPage.createLead({
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        notes: leadData.notes,
      });
      await createLeadPage.expectSuccess();
    });

    // ──────────────────────────────────────────────
    // Step 6: Verify lead appears in the dashboard list
    // ──────────────────────────────────────────────
    await test.step("Verify newly created lead appears in the lead list", async () => {
      // After successful creation the app navigates to /leads
      // and the new lead is shown at the top of the list.
      await page.waitForLoadState("networkidle");
      await dashboardPage.expectLeadVisible(leadData.name);
    });
  });
});
