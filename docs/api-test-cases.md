# API Test Cases

## Application Under Test

- **API Base URL:** `https://v0-lead-manager-app.vercel.app/api`
- **Date:** 2026-03-17

---

## 1. Login API – `POST /api/login`

### TC-API-LOGIN-001 – Successful login with Admin credentials

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `POST /api/login` |
| **Headers**      | `Content-Type: application/json` |
| **Request Body** | `{ "email": "admin@company.com", "password": "Admin@123" }` |
| **Expected Status** | `200 OK` |
| **Expected Response** | `success: true`, `token` is non-empty string, `email: "admin@company.com"`, `role: "admin"` |

---

### TC-API-LOGIN-002 – Successful login with Manager credentials

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `POST /api/login` |
| **Request Body** | `{ "email": "qa@company.com", "password": "password123" }` |
| **Expected Status** | `200 OK` |
| **Expected Response** | `success: true`, `role: "manager"` |

---

### TC-API-LOGIN-003 – Successful login with Viewer credentials

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `POST /api/login` |
| **Request Body** | `{ "email": "tester@company.com", "password": "Test@456" }` |
| **Expected Status** | `200 OK` |
| **Expected Response** | `success: true`, `role: "viewer"` |

---

### TC-API-LOGIN-004 – Login with wrong password

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `POST /api/login` |
| **Request Body** | `{ "email": "admin@company.com", "password": "wrongpass" }` |
| **Expected Status** | `400` or `401` |
| **Expected Response** | `success: false`, error message present |

---

### TC-API-LOGIN-005 – Login with unregistered email

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `POST /api/login` |
| **Request Body** | `{ "email": "unknown@test.com", "password": "password123" }` |
| **Expected Status** | `400` or `401` |
| **Expected Response** | `success: false` |

---

### TC-API-LOGIN-006 – Login with invalid email format

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Endpoint**     | `POST /api/login` |
| **Request Body** | `{ "email": "notanemail", "password": "password123" }` |
| **Expected Status** | `400` or `401` |
| **Expected Response** | `success: false` |

---

### TC-API-LOGIN-007 – Login with empty email and password

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `POST /api/login` |
| **Request Body** | `{ "email": "", "password": "" }` |
| **Expected Status** | `400` or `401` |
| **Expected Response** | `success: false` |

---

### TC-API-LOGIN-008 – Login with missing request body

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Endpoint**     | `POST /api/login` |
| **Request Body** | `{}` |
| **Expected Status** | `400` or `401` |
| **Expected Response** | `success: false` |

---

## 2. Authorization Tests

### TC-API-AUTH-001 – GET /api/leads without Authorization header

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `GET /api/leads` |
| **Headers**      | No Authorization header |
| **Expected Status** | `401 Unauthorized` |
| **Expected Response** | `success: false`, `error: "Authorization header is required"` |

---

### TC-API-AUTH-002 – GET /api/leads with invalid token

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `GET /api/leads` |
| **Headers**      | `Authorization: Bearer invalid_token_xyz` |
| **Expected Status** | `401 Unauthorized` |
| **Expected Response** | `success: false`, `error: "Invalid or expired token"` |

---

### TC-API-AUTH-003 – POST /api/leads without Authorization header

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `POST /api/leads` |
| **Headers**      | No Authorization header |
| **Request Body** | Valid lead payload |
| **Expected Status** | `401 Unauthorized` |

---

### TC-API-AUTH-004 – GET /api/leads with valid token

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `GET /api/leads` |
| **Headers**      | `Authorization: Bearer Bearer_ADMIN_TEST_TOKEN_12345` |
| **Expected Status** | `200 OK` |
| **Expected Response** | `success: true`, `leads` is an array |

---

## 3. Leads API – GET (List & Pagination)

### TC-API-LIST-001 – Get leads with default pagination

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `GET /api/leads` |
| **Headers**      | `Authorization: Bearer {admin_token}` |
| **Expected Status** | `200 OK` |
| **Expected Response** | `success: true`, `leads` is non-empty array, `total` > 0, `page: 1`, `pageSize` present |

---

### TC-API-LIST-002 – Get leads with custom page size

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `GET /api/leads?page=1&pageSize=3` |
| **Headers**      | `Authorization: Bearer {admin_token}` |
| **Expected Status** | `200 OK` |
| **Expected Response** | `leads.length` ≤ 3, `page: 1`, `pageSize: 3` |

---

### TC-API-LIST-003 – Get leads page 2

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `GET /api/leads?page=2&pageSize=5` |
| **Headers**      | `Authorization: Bearer {admin_token}` |
| **Expected Status** | `200 OK` |
| **Expected Response** | `page: 2`, leads array contains different items than page 1 |

---

### TC-API-LIST-004 – Lead object has all expected fields

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `GET /api/leads?page=1&pageSize=1` |
| **Headers**      | `Authorization: Bearer {admin_token}` |
| **Expected Status** | `200 OK` |
| **Expected Response** | Each lead object contains: `id`, `name`, `email`, `priority`, `status`, `isQualified`, `emailOptIn`, `createdAt`, `updatedAt` |

---

## 4. Leads API – POST (Create Lead)

### TC-API-CREATE-001 – Create lead with valid minimal data

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `POST /api/leads` |
| **Headers**      | `Authorization: Bearer {admin_token}`, `Content-Type: application/json` |
| **Request Body** | `{ "name": "API Lead", "email": "api.lead@test.com", "priority": "Medium", "status": "New", "isQualified": false, "emailOptIn": false, "notes": "" }` |
| **Expected Status** | `201 Created` |
| **Expected Response** | `success: true`, `lead.name: "API Lead"`, `lead.id` is present, `lead.createdAt` is present |

---

### TC-API-CREATE-002 – Create lead with missing name

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `POST /api/leads` |
| **Request Body** | `{ "email": "valid@email.com", "priority": "Medium", "status": "New", "isQualified": false, "emailOptIn": false, "notes": "" }` |
| **Expected Status** | `400 Bad Request` |
| **Expected Response** | `success: false`, `errors` array contains entry for `name` field |

---

### TC-API-CREATE-003 – Create lead with invalid email format

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `POST /api/leads` |
| **Request Body** | `{ "name": "Bad Email", "email": "not-an-email", "priority": "Medium", "status": "New", "isQualified": false, "emailOptIn": false, "notes": "" }` |
| **Expected Status** | `400 Bad Request` |
| **Expected Response** | `success: false`, validation error for `email` field |

---

### TC-API-CREATE-004 – Create lead with empty name and invalid email (Multiple errors)

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `POST /api/leads` |
| **Request Body** | `{ "name": "", "email": "invalid", "priority": "Medium", "status": "New", "isQualified": false, "emailOptIn": false, "notes": "" }` |
| **Expected Status** | `400 Bad Request` |
| **Expected Response** | `success: false`, `errors` array has ≥ 2 entries (one for name, one for email) |

---

### TC-API-CREATE-005 – Create lead with empty request body

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Endpoint**     | `POST /api/leads` |
| **Request Body** | `{}` |
| **Expected Status** | `400 Bad Request` |
| **Expected Response** | `success: false` |

---

### TC-API-CREATE-006 – Newly created lead appears in GET /api/leads

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Endpoint**     | `POST /api/leads` → `GET /api/leads` |
| **Preconditions** | Valid admin token |
| **Steps**        | 1. Create a lead with unique name/email via POST <br> 2. GET /api/leads with large pageSize <br> 3. Search response for the created lead's ID |
| **Expected Status** | POST: `201`, GET: `200` |
| **Expected Response** | The created lead (matching by `id`) appears in the GET response with the same `name` and `email`. |

---

## Test Case Summary

| Category       | Total | Critical | High | Medium | Low |
|----------------|-------|----------|------|--------|-----|
| Login API      | 8     | 2        | 3    | 2      | 1   |
| Authorization  | 4     | 4        | 0    | 0      | 0   |
| List Leads     | 4     | 1        | 3    | 0      | 0   |
| Create Lead    | 6     | 4        | 2    | 0      | 0   |
| **Total**      | **22**| **11**   | **8**| **2**  | **1**|
