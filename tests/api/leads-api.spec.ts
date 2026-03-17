import { test, expect, APIRequestContext } from "@playwright/test";
import { USERS, INVALID_LOGINS, generateMinimalLead, BASE_URL } from "../fixtures/test-data";

/**
 * API Test Suite for Lead Manager
 *
 * Covers:
 *  - Login API (positive & negative)
 *  - Leads API – CRUD operations
 *  - Authorization & error handling
 */

let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: { "Content-Type": "application/json" },
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN API
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("POST /api/login", () => {
  test("should login successfully with valid admin credentials", async () => {
    const response = await apiContext.post("/api/login", {
      data: { email: USERS.admin.email, password: USERS.admin.password },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.token).toBeTruthy();
    expect(body.email).toBe(USERS.admin.email);
    expect(body.role).toBe("admin");
  });

  test("should login successfully with manager credentials", async () => {
    const response = await apiContext.post("/api/login", {
      data: { email: USERS.manager.email, password: USERS.manager.password },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.token).toBeTruthy();
    expect(body.role).toBe("manager");
  });

  test("should login successfully with viewer credentials", async () => {
    const response = await apiContext.post("/api/login", {
      data: { email: USERS.viewer.email, password: USERS.viewer.password },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.role).toBe("viewer");
  });

  test("should reject wrong password", async () => {
    const response = await apiContext.post("/api/login", {
      data: INVALID_LOGINS.wrongPassword,
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("should reject unregistered email", async () => {
    const response = await apiContext.post("/api/login", {
      data: INVALID_LOGINS.unregisteredEmail,
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("should reject invalid email format", async () => {
    const response = await apiContext.post("/api/login", {
      data: INVALID_LOGINS.invalidEmailFormat,
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("should reject empty credentials", async () => {
    const response = await apiContext.post("/api/login", {
      data: INVALID_LOGINS.emptyFields,
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("should reject request with missing body", async () => {
    const response = await apiContext.post("/api/login", { data: {} });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEADS API – AUTHORIZATION
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("Leads API – Authorization", () => {
  test("GET /api/leads should return 401 without Authorization header", async () => {
    const response = await apiContext.get("/api/leads");

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Authorization");
  });

  test("GET /api/leads should return 401 with invalid token", async () => {
    const response = await apiContext.get("/api/leads", {
      headers: { Authorization: "Bearer invalid_token_xyz" },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("POST /api/leads should return 401 without Authorization header", async () => {
    const response = await apiContext.post("/api/leads", {
      data: generateMinimalLead("noauth"),
    });

    expect(response.status()).toBe(401);
  });

  test("GET /api/leads should succeed with valid Bearer token", async () => {
    const response = await apiContext.get("/api/leads", {
      headers: { Authorization: `Bearer ${USERS.admin.token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.leads)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEADS API – GET (LIST & PAGINATION)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("GET /api/leads – List & Pagination", () => {
  const authHeaders = { Authorization: `Bearer ${USERS.admin.token}` };

  test("should return a paginated list of leads with default page size", async () => {
    const response = await apiContext.get("/api/leads", { headers: authHeaders });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.leads)).toBe(true);
    expect(body.leads.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThan(0);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBeDefined();
  });

  test("should respect page and pageSize query parameters", async () => {
    const response = await apiContext.get("/api/leads?page=1&pageSize=3", {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.leads.length).toBeLessThanOrEqual(3);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(3);
  });

  test("should return page 2 with correct offset", async () => {
    const response = await apiContext.get("/api/leads?page=2&pageSize=5", {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(2);
    expect(body.leads.length).toBeGreaterThan(0);
  });

  test("each lead should have the expected fields", async () => {
    const response = await apiContext.get("/api/leads?page=1&pageSize=1", {
      headers: authHeaders,
    });

    const body = await response.json();
    const lead = body.leads[0];
    expect(lead).toHaveProperty("id");
    expect(lead).toHaveProperty("name");
    expect(lead).toHaveProperty("email");
    expect(lead).toHaveProperty("priority");
    expect(lead).toHaveProperty("status");
    expect(lead).toHaveProperty("createdAt");
    expect(lead).toHaveProperty("updatedAt");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEADS API – POST (CREATE LEAD)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("POST /api/leads – Create Lead", () => {
  const authHeaders = { Authorization: `Bearer ${USERS.admin.token}` };

  test("should create a lead with valid minimal data", async () => {
    const leadData = generateMinimalLead("api-pos");

    const response = await apiContext.post("/api/leads", {
      headers: authHeaders,
      data: leadData,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.lead).toBeDefined();
    expect(body.lead.name).toBe(leadData.name);
    expect(body.lead.email).toBe(leadData.email);
    expect(body.lead.id).toBeTruthy();
    expect(body.lead.createdAt).toBeTruthy();
  });

  test("should reject lead creation with missing name", async () => {
    const response = await apiContext.post("/api/leads", {
      headers: authHeaders,
      data: {
        email: "valid@email.com",
        priority: "Medium",
        status: "New",
        isQualified: false,
        emailOptIn: false,
        notes: "",
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors).toBeDefined();
  });

  test("should reject lead creation with invalid email format", async () => {
    const response = await apiContext.post("/api/leads", {
      headers: authHeaders,
      data: {
        name: "Invalid Email Lead",
        email: "not-an-email",
        priority: "Medium",
        status: "New",
        isQualified: false,
        emailOptIn: false,
        notes: "",
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("should reject lead creation with empty name and invalid email", async () => {
    const response = await apiContext.post("/api/leads", {
      headers: authHeaders,
      data: {
        name: "",
        email: "invalid",
        priority: "Medium",
        status: "New",
        isQualified: false,
        emailOptIn: false,
        notes: "",
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors.length).toBeGreaterThanOrEqual(2);
  });

  test("should reject lead creation with empty request body", async () => {
    const response = await apiContext.post("/api/leads", {
      headers: authHeaders,
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("newly created lead should appear in GET /api/leads", async () => {
    const leadData = generateMinimalLead("verify");

    // Create
    const createResponse = await apiContext.post("/api/leads", {
      headers: authHeaders,
      data: leadData,
    });
    expect(createResponse.status()).toBe(201);
    const created = (await createResponse.json()).lead;

    // Fetch all (large page size to include the new one)
    const listResponse = await apiContext.get("/api/leads?page=1&pageSize=100", {
      headers: authHeaders,
    });
    const listBody = await listResponse.json();
    const found = listBody.leads.find((l: any) => l.id === created.id);

    expect(found).toBeDefined();
    expect(found.name).toBe(leadData.name);
    expect(found.email).toBe(leadData.email);
  });
});
