# Manual Test Cases – UI

## Feature: Login → Create Lead → List Lead

**Application Under Test:** Lead Manager SaaS  
**Test UI URL:** https://v0-lead-manager-app.vercel.app  
**Tester:** QA Lead  
**Date:** 2026-03-17

---

## 1. Login Functionality

### TC-LOGIN-001 – Successful login with Admin credentials

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | Browser is open; user is not already logged in |
| **Steps**        | 1. Navigate to `https://v0-lead-manager-app.vercel.app` <br> 2. Enter email: `admin@company.com` <br> 3. Enter password: `Admin@123` <br> 4. Click **Sign In** |
| **Expected Result** | User is redirected to the Dashboard page. The dashboard displays a list of leads. |

---

### TC-LOGIN-002 – Successful login with Manager credentials

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | Browser is open; user is not already logged in |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `qa@company.com` <br> 3. Enter password: `password123` <br> 4. Click **Sign In** |
| **Expected Result** | User is redirected to the Dashboard. The user should have Create, Edit, View, Export permissions but no Delete. |

---

### TC-LOGIN-003 – Successful login with Viewer credentials

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | Browser is open; user is not already logged in |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `tester@company.com` <br> 3. Enter password: `Test@456` <br> 4. Click **Sign In** |
| **Expected Result** | User is redirected to the Dashboard with read-only access. Create/Edit/Delete buttons should not be visible or should be disabled. |

---

### TC-LOGIN-004 – Login with wrong password (Negative)

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | Browser is open; user is not logged in |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `admin@company.com` <br> 3. Enter password: `wrongpass` <br> 4. Click **Sign In** |
| **Expected Result** | An error message is displayed (e.g., "Invalid credentials"). The user remains on the login page. |

---

### TC-LOGIN-005 – Login with unregistered email (Negative)

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `unknown@test.com` <br> 3. Enter password: `password123` <br> 4. Click **Sign In** |
| **Expected Result** | An error message is displayed. The user remains on the login page. |

---

### TC-LOGIN-006 – Login with invalid email format (Validation)

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `notanemail` <br> 3. Enter password: `password123` <br> 4. Click **Sign In** |
| **Expected Result** | A validation error is shown for the email field (e.g., "Please enter a valid email address") or browser native validation prevents submission. |

---

### TC-LOGIN-007 – Login with empty email and password (Validation)

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Leave both Email and Password fields empty <br> 3. Click **Sign In** |
| **Expected Result** | Validation errors appear for both fields. The form is not submitted. |

---

### TC-LOGIN-008 – Login with empty password only (Validation)

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `admin@company.com` <br> 3. Leave password empty <br> 4. Click **Sign In** |
| **Expected Result** | A validation error is displayed for the password field. |

---

### TC-LOGIN-009 – Login with empty email only (Validation)

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Leave email empty <br> 3. Enter password: `Admin@123` <br> 4. Click **Sign In** |
| **Expected Result** | A validation error is displayed for the email field. |

---

### TC-LOGIN-010 – Login with leading/trailing spaces in credentials (Edge Case)

| Field            | Details |
|------------------|---------|
| **Priority**     | Low |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `  admin@company.com  ` (with spaces) <br> 3. Enter password: `Admin@123` <br> 4. Click **Sign In** |
| **Expected Result** | Application either trims the whitespace and logs in successfully, or shows an error. Behavior should be consistent. |

---

### TC-LOGIN-011 – Login with SQL injection attempt (Security Edge Case)

| Field            | Details |
|------------------|---------|
| **Priority**     | Low |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Enter email: `admin@company.com' OR '1'='1` <br> 3. Enter password: `' OR '1'='1` <br> 4. Click **Sign In** |
| **Expected Result** | Login fails gracefully with an error message. No unauthorized access. |

---

### TC-LOGIN-012 – Password field is masked

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Preconditions** | Browser is open |
| **Steps**        | 1. Navigate to the login page <br> 2. Click on the Password input field <br> 3. Type any text |
| **Expected Result** | The characters are masked (shown as dots/bullets), confirming `type="password"`. |

---

## 2. Create Lead Functionality

### TC-CREATE-001 – Create lead with all required fields (Happy Path)

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | User is logged in as Admin and is on the Dashboard |
| **Steps**        | 1. Click "Create Lead" / "Add Lead" button <br> 2. Enter Name: `John Doe` <br> 3. Enter Email: `john.doe@test.com` <br> 4. Select Priority: `Medium` <br> 5. Select Status: `New` <br> 6. Click **Create** / **Save** |
| **Expected Result** | Lead is created successfully. A success message is shown or user is redirected to the list. The new lead appears in the lead list. |

---

### TC-CREATE-002 – Create lead with all fields filled

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | User is logged in as Admin |
| **Steps**        | 1. Click "Create Lead" <br> 2. Fill in: Name: `Jane Smith`, Email: `jane@corp.com`, Phone: `+1 (555) 111-2222`, Company: `Corp Inc`, Job Title: `CTO`, Industry: `Technology`, Source: `LinkedIn`, Priority: `High`, Status: `New`, Deal Value: `100000`, Expected Close Date: `2026-06-01`, Follow-up Date: `2026-04-01`, Is Qualified: checked, Email Opt-In: checked, Notes: `Interested in premium plan` <br> 3. Click **Create** |
| **Expected Result** | Lead is created with all fields saved correctly. All field values are reflected in the lead detail/list. |

---

### TC-CREATE-003 – Create lead with missing Name (Negative)

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Leave the Name field empty <br> 2. Enter Email: `test@test.com` <br> 3. Fill remaining required fields <br> 4. Click **Create** |
| **Expected Result** | A validation error is displayed for the Name field (e.g., "Name is required"). Lead is NOT created. |

---

### TC-CREATE-004 – Create lead with missing Email (Negative)

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Enter Name: `Test Lead` <br> 2. Leave the Email field empty <br> 3. Fill remaining required fields <br> 4. Click **Create** |
| **Expected Result** | A validation error is displayed for the Email field. Lead is NOT created. |

---

### TC-CREATE-005 – Create lead with invalid email format (Validation)

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Enter Name: `Test Lead` <br> 2. Enter Email: `not-valid-email` <br> 3. Fill remaining required fields <br> 4. Click **Create** |
| **Expected Result** | A validation error is displayed for the Email field (e.g., "Invalid email format"). Lead is NOT created. |

---

### TC-CREATE-006 – Create lead with all fields empty (Negative)

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Leave ALL fields empty/default <br> 2. Click **Create** |
| **Expected Result** | Validation errors are shown for all required fields. Form is not submitted. |

---

### TC-CREATE-007 – Create lead with duplicate email (Edge Case)

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Preconditions** | A lead with email `existing@test.com` already exists |
| **Steps**        | 1. Open Create Lead form <br> 2. Enter Name: `Duplicate Lead` <br> 3. Enter Email: `existing@test.com` (same as existing lead) <br> 4. Fill other required fields <br> 5. Click **Create** |
| **Expected Result** | Either: (a) An error indicates the email already exists, or (b) the system allows duplicate emails (acceptable if by design). Document actual behavior. |

---

### TC-CREATE-008 – Create lead with very long Name (Edge Case)

| Field            | Details |
|------------------|---------|
| **Priority**     | Low |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Enter Name: a string of 300 characters <br> 2. Enter valid Email <br> 3. Fill other required fields <br> 4. Click **Create** |
| **Expected Result** | Either: (a) The input is truncated to a max length, or (b) a validation error is shown, or (c) lead is created with the long name. The system should not crash. |

---

### TC-CREATE-009 – Create lead with special characters in Name (Edge Case)

| Field            | Details |
|------------------|---------|
| **Priority**     | Low |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Enter Name: `O'Brien-Smith <script>alert(1)</script>` <br> 2. Enter valid Email <br> 3. Fill other required fields <br> 4. Click **Create** |
| **Expected Result** | Lead is either created with the name properly escaped (no XSS), or a validation error is shown. The script tag must NOT execute. |

---

### TC-CREATE-010 – Cancel lead creation and verify no data saved

| Field            | Details |
|------------------|---------|
| **Priority**     | Medium |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Fill in Name: `Cancel Test` and Email: `cancel@test.com` <br> 2. Click **Cancel** / **Back** (without submitting) |
| **Expected Result** | User is returned to the dashboard. No new lead named "Cancel Test" exists in the list. |

---

### TC-CREATE-011 – Create lead with negative deal value (Edge Case)

| Field            | Details |
|------------------|---------|
| **Priority**     | Low |
| **Preconditions** | User is logged in and on the Create Lead form |
| **Steps**        | 1. Fill required fields with valid data <br> 2. Enter Deal Value: `-5000` <br> 3. Click **Create** |
| **Expected Result** | Either a validation error is shown, or the system prevents negative values. The system should handle this gracefully. |

---

## 3. List Leads / Dashboard Functionality

### TC-LIST-001 – Dashboard displays leads after login

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | User has just logged in as Admin |
| **Steps**        | 1. Login with valid admin credentials <br> 2. Observe the Dashboard page |
| **Expected Result** | The dashboard loads and displays a list of leads in a table/card layout. Each lead shows at minimum: Name, Email, Priority, Status. |

---

### TC-LIST-002 – Newly created lead appears in the list

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | User is logged in as Admin |
| **Steps**        | 1. Note the current lead count <br> 2. Create a new lead (e.g., Name: `Fresh Lead`, Email: `fresh@test.com`) <br> 3. Return to or observe the lead list |
| **Expected Result** | The newly created lead is visible in the list with the correct Name and Email. |

---

### TC-LIST-003 – Leads list supports pagination

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | More leads exist than the default page size (>10) |
| **Steps**        | 1. Login and view the dashboard <br> 2. Observe the pagination controls <br> 3. Click "Next" / page 2 |
| **Expected Result** | Page 2 loads with a different set of leads. Pagination controls update to reflect the current page. |

---

### TC-LIST-004 – Lead list shows correct columns / fields

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | User is logged in and on the Dashboard |
| **Steps**        | 1. Observe the lead list/table on the Dashboard |
| **Expected Result** | The list displays essential columns: Name, Email, Company, Priority, Status. Data in each column is correctly populated. |

---

### TC-LIST-005 – Dashboard is not accessible without login (Security)

| Field            | Details |
|------------------|---------|
| **Priority**     | Critical |
| **Preconditions** | User is NOT logged in (no active session) |
| **Steps**        | 1. Open the Dashboard URL directly (e.g., `/dashboard`) in a new browser tab without logging in |
| **Expected Result** | User is redirected to the login page or shown an "Unauthorized" message. The lead list is NOT displayed. |

---

### TC-LIST-006 – Lead data integrity between create and list

| Field            | Details |
|------------------|---------|
| **Priority**     | High |
| **Preconditions** | User is logged in as Admin |
| **Steps**        | 1. Create a lead with known data: Name: `Integrity Check`, Email: `integrity@check.com`, Priority: `High`, Status: `New` <br> 2. Go back to the Dashboard <br> 3. Find the newly created lead in the list |
| **Expected Result** | The lead's Name, Email, Priority, and Status in the list match exactly what was entered during creation. |

---

### TC-LIST-007 – Empty state when no leads exist

| Field            | Details |
|------------------|---------|
| **Priority**     | Low |
| **Preconditions** | All leads have been deleted (or fresh environment with no leads) |
| **Steps**        | 1. Login and view the Dashboard |
| **Expected Result** | A user-friendly message is displayed (e.g., "No leads found" or "Get started by creating a lead"). The page does not show errors or an empty table with no explanation. |

---

## Test Case Summary

| Category       | Total | Critical | High | Medium | Low |
|----------------|-------|----------|------|--------|-----|
| Login          | 12    | 3        | 3    | 4      | 2   |
| Create Lead    | 11    | 3        | 3    | 2      | 3   |
| List Leads     | 7     | 3        | 3    | 0      | 1   |
| **Total**      | **30**| **9**    | **9**| **6**  | **6**|
