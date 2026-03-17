import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Lead Manager QA test suite.
 * Covers both UI (browser) and API (headless request) tests.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // run sequentially – tests share application state
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 60_000,

  use: {
    baseURL: "https://v0-lead-manager-app.vercel.app",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "ui-chromium",
      testDir: "./tests/ui",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        // API tests don't need a browser
        baseURL: "https://v0-lead-manager-app.vercel.app",
      },
    },
  ],
});
