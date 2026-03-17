/**
 * Shared test data and constants used across UI and API tests.
 */

export const BASE_URL = "https://v0-lead-manager-app.vercel.app";
export const API_BASE = `${BASE_URL}/api`;

// ─── User Credentials ───────────────────────────────────────────────────────

export const USERS = {
  admin: {
    email: "admin@company.com",
    password: "Admin@123",
    role: "admin",
    token: "Bearer_ADMIN_TEST_TOKEN_12345",
  },
  manager: {
    email: "qa@company.com",
    password: "password123",
    role: "manager",
    token: "Bearer_MANAGER_TEST_TOKEN_12345",
  },
  viewer: {
    email: "tester@company.com",
    password: "Test@456",
    role: "viewer",
    token: "Bearer_VIEWER_TEST_TOKEN_12345",
  },
} as const;

// ─── Invalid Credentials for Negative Tests ─────────────────────────────────

export const INVALID_LOGINS = {
  wrongPassword: { email: "admin@company.com", password: "wrongpass" },
  unregisteredEmail: { email: "unknown@test.com", password: "password123" },
  invalidEmailFormat: { email: "notanemail", password: "password123" },
  emptyFields: { email: "", password: "" },
};

// ─── Lead Test Data ─────────────────────────────────────────────────────────

export function generateUniqueLead(suffix?: string) {
  const ts = Date.now();
  const tag = suffix ?? ts.toString();
  return {
    name: `QA Test Lead ${tag}`,
    email: `qa.lead.${tag}@testmail.com`,
    phone: "+1 (555) 999-0001",
    company: "QA Corp",
    jobTitle: "QA Engineer",
    industry: "Technology",
    source: "Website",
    priority: "Medium" as const,
    status: "New" as const,
    dealValue: 50000,
    expectedCloseDate: "2026-06-01",
    followUpDate: "2026-04-01",
    isQualified: false,
    emailOptIn: false,
    notes: `Automated test lead created at ${new Date().toISOString()}`,
  };
}

/** Minimal payload required by POST /api/leads */
export function generateMinimalLead(suffix?: string) {
  const ts = Date.now();
  const tag = suffix ?? ts.toString();
  return {
    name: `Min Lead ${tag}`,
    email: `min.lead.${tag}@test.com`,
    priority: "Medium" as const,
    status: "New" as const,
    isQualified: false,
    emailOptIn: false,
    notes: "",
  };
}
