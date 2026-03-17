# QA Lead Assignment – Lead Manager Test Suite

Automated and manual QA test suite for the **Lead Manager** SaaS application, covering UI end-to-end flows and REST API testing.

| Item | Detail |
|------|--------|
| **Application URL** | https://v0-lead-manager-app.vercel.app |
| **API Base URL** | https://v0-lead-manager-app.vercel.app/api |
| **Language** | TypeScript |
| **Test Framework** | [Playwright](https://playwright.dev/) |
| **Design Pattern** | Page Object Model (UI tests) |

---

## Repository Structure

```
qa-lead-assignment/
├── docs/
│   ├── manual-test-cases.md      # Part 1 – Manual UI test cases
│   └── api-test-cases.md         # Part 3 – API test cases (documented)
├── tests/
│   ├── fixtures/
│   │   └── test-data.ts          # Shared test data, credentials, helpers
│   ├── ui/
│   │   ├── pages/
│   │   │   ├── LoginPage.ts      # Page Object – Login
│   │   │   ├── DashboardPage.ts  # Page Object – Dashboard / Lead List
│   │   │   └── CreateLeadPage.ts # Page Object – Create Lead Form
│   │   └── lead-management-e2e.spec.ts   # Part 2 – UI automation
│   └── api/
│       └── leads-api.spec.ts     # Part 3 – API automation
├── playwright.config.ts          # Playwright configuration
├── package.json
├── tsconfig.json
└── README.md                     # ← You are here
```

---

## Prerequisites

| Requirement | Version | How to check |
|-------------|---------|-------------|
| **Node.js** | ≥ 18.x | `node --version` |
| **npm** | ≥ 9.x | `npm --version` |
| **Git** | Any recent version | `git --version` |
| **Code Editor** | VS Code (recommended) or any editor | — |
| **OS** | Windows / macOS / Linux | — |

> **Note:** No local server, database, or environment variables are needed – all tests run against the deployed application at `https://v0-lead-manager-app.vercel.app`.

---

## Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/sunny8421/Playwright.git
cd Playwright

# 2. Install project dependencies
npm install

# 3. Install Playwright browser engine (Chromium – required for UI tests)
npx playwright install --with-deps chromium
```

That's it — you're ready to run tests.

---

## How to Execute Automated Tests

### Run all tests (UI + API)

```bash
npm test
```

### Run only UI tests (headed browser – visible)

```bash
npm run test:headed
```

### Run only UI tests (headless)

```bash
npm run test:ui
```

### Run only API tests

```bash
npm run test:api
```

### Debug a test interactively

```bash
npm run test:debug
```

### View the HTML test report

```bash
npm run test:report
```

The report opens in your browser and shows results for every test, with screenshots and traces for failures.

---

## Tools & Frameworks Used

| Tool / Library | Version | Purpose |
|----------------|---------|---------||
| **Playwright** (`@playwright/test`) | ^1.50.0 | UI browser automation & API request testing |
| **Chromium** (via Playwright) | Auto-managed | Browser engine used for UI tests (downloaded by `npx playwright install`) |
| **TypeScript** | Via `@types/node ^22.0.0` | Type-safe test authoring |
| **Node.js** | ≥ 18.x | JavaScript runtime |
| **Page Object Model** | — | Design pattern for clean separation between locators and test logic |
| **Playwright HTML Reporter** | Built-in | Interactive test report with traces, screenshots, and videos |

### Key npm packages (from `package.json`)

```
@playwright/test  – Test runner, assertions, browser & API automation
@types/node       – TypeScript type definitions for Node.js
```

---

## Deliverables Checklist

| # | Deliverable | Location |
|---|-------------|----------|
| 1 | Manual UI Test Cases | [`docs/manual-test-cases.md`](docs/manual-test-cases.md) |
| 2 | UI Automation (Login → Create Lead → List Lead) | [`tests/ui/lead-management-e2e.spec.ts`](tests/ui/lead-management-e2e.spec.ts) |
| 3 | API Test Cases (documented) | [`docs/api-test-cases.md`](docs/api-test-cases.md) |
| 4 | API Automation | [`tests/api/leads-api.spec.ts`](tests/api/leads-api.spec.ts) |
| 5 | README with setup & run instructions | This file |

---

## Test Credentials (for reference)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@company.com` | `Admin@123` |
| Manager | `qa@company.com` | `password123` |
| Viewer | `tester@company.com` | `Test@456` |
