# JobPulse Live — API Testing Report

## 1. Testing Scope

REST API testing was performed using Postman and covered the following endpoints, flows, and validation scenarios:

- Provider status
- Applications GET
- Application creation
- Application update
- Application deletion
- Analytics
- Job search
- Pagination
- Location filtering
- Category filtering
- Contract/job-type filtering
- Response structure
- Boundary and invalid parameter testing
- Negative testing

## 2. Test Environment

- **Application:** JobPulse Live
- **Testing Tool:** Postman
- **API Base URL:** http://127.0.0.1:5000
- **Testing Type:** REST API / Functional / Negative / Boundary Testing

## 3. API Test Execution Results

| Test Case ID | Test Scenario / Endpoint | Status | Notes / Observations |
| :--- | :--- | :--- | :--- |
| TC-023 | GET /api/provider/status | PASS | Provider status endpoint returned valid operational status. |
| TC-024 | GET /api/applications | PASS | Observation: mixed source_name values present in records. |
| TC-025 | POST /api/applications — missing required fields | PASS | Handled cleanly with expected validation response. |
| TC-026 | POST /api/applications — valid application | PASS | Valid application created successfully. |
| TC-027 | DELETE test application | PASS | Test application deleted successfully. |
| TC-028 | DELETE invalid application ID | PASS | Expected 404 behavior returned. |
| TC-029 | PUT /api/applications/:id — update application | PASS | Application updated successfully. |
| TC-030 | GET /api/analytics | PASS | Analytics endpoint returned metrics accurately. |
| TC-031 | GET /api/jobs/search — keyword + location | FAIL | Job search API did not apply keyword parameter correctly. |
| TC-032 | API pagination | PASS | Pagination parameters functioned properly. |
| TC-033 | API location filter | PASS | Location filter applied correctly. |
| TC-034 | API category filter | FAIL | Category parameter was not correctly applied by API. |
| TC-035 | API contract/job type filter | FAIL | Contract/job type parameter was not correctly applied by API. |
| TC-036 | Invalid page value: page=abc | FAIL | Non-numeric page value silently falls back to page 1. |
| TC-037 | GET jobs/search with no parameters | PASS | Default job search results returned cleanly. |
| TC-038 | API response structure | PASS | Response JSON structure matched expected schema. |
| TC-039 | limit=5 | PASS | Results limited accurately to 5 items. |
| TC-040 | limit=0 | FAIL | limit=0 silently defaulted instead of being validated. |
| TC-041 | limit=-5 | FAIL | Negative limit (-5) accepted and normalized. |
| TC-042 | limit=1000 | FAIL | Large limit (1000) silently capped at 50 without explicit validation. |
| TC-043 | page=0 | FAIL | page=0 silently defaulted to page 1. |
| TC-044 | page=-1 | FAIL | Negative page (-1) silently defaulted to page 1. |
| TC-045 | limit=abc | FAIL | Non-numeric limit (abc) silently defaulted to 10. |
| TC-046 | page=abc — duplicate/reconfirmation of TC-036 | FAIL / RECONFIRMATION | Reconfirmation of TC-036 behavior. |

## 4. Confirmed API Defects

### BUG-003
- **Title:** Job Search API Ignores Keyword
- **Severity:** High
- **Priority:** High
- **Status:** Open
- **Description:** The job search API did not correctly apply the supplied keyword parameter.

### BUG-004
- **Title:** Job Search API Ignores Category
- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** The category parameter was not correctly applied by the job search API.

### BUG-005
- **Title:** Job Search API Ignores Contract / Job Type
- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** The contract/job type parameter was not correctly applied by the job search API.

### BUG-006
- **Title:** Invalid Page Value Silently Falls Back
- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** An invalid non-numeric page value such as `page=abc` silently falls back to page 1 instead of being rejected or clearly validated.

### BUG-007
- **Title:** limit=0 Silently Defaults
- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** `limit=0` is silently normalized/defaulted instead of being explicitly validated.

### BUG-008
- **Title:** Negative Limit Accepted
- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A negative limit such as `-5` is accepted and normalized instead of being rejected through input validation.

### BUG-009
- **Title:** Large Limit Silently Capped
- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A very large limit such as `1000` is silently capped at 50. The concern is the undocumented/silent behavior rather than the existence of a maximum limit itself.

### BUG-010
- **Title:** page=0 Silently Defaults
- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** `page=0` silently defaults to page 1 instead of being explicitly validated.

### BUG-011
- **Title:** Negative Page Silently Defaults
- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A negative page value such as `-1` silently defaults to page 1.

### BUG-012
- **Title:** Non-numeric Limit Silently Defaults
- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A non-numeric limit such as `abc` silently defaults to 10 instead of being explicitly validated.

## 5. API Observations

### OBS-002
- **Title:** Mixed source_name Values
- **Description:** Application records contained mixed `source_name` values, including:
  - "Adzuna Demo / PhonePe Careers"
  - "Adzuna Demo / Razorpay Careers"
  - "Live Job API"
  - "Adzuna (IN)"
  
  This was treated as an observation and NOT a confirmed defect.

## 6. Important QA Interpretation

- **TC-046** is a duplicate/reconfirmation of **TC-036** and should NOT be counted as a separate defect.
- Several failed tests are boundary/negative validation cases.
- The presence of a FAIL does not automatically mean the entire API is unusable.
- **BUG-009** concerns silent/undocumented capping behavior, not necessarily the existence of a maximum limit itself.
- API location filtering, pagination, response structure, CRUD operations, and analytics were successfully validated.
- The report reflects actual Postman execution and does not claim unsupported coverage.

## 7. Summary

- **API Areas Tested:** Provider status, application CRUD operations, analytics metrics, job search, location/category/contract filters, response schemas, and parameter validation.
- **Successful Tests:** 13 test cases passed successfully (including full CRUD, 404 handling, location filtering, and valid pagination).
- **Failed Tests:** 11 test cases failed (comprising core parameter filter bugs and input boundary normalization behaviors).
- **Confirmed API Defects:** 10 open defects logged (BUG-003 to BUG-012), ranging from High severity (keyword parameter ignored) to Low severity (silent input normalization).
- **Observations:** 1 observation logged (OBS-002: mixed `source_name` metadata values).
- **Boundary / Negative Testing:** Rigorously performed across non-numeric (`abc`), negative (`-5`, `-1`), zero (`0`), and out-of-range (`1000`) parameter bounds.

Report prepared from actual Postman API test execution performed during QA validation of JobPulse Live.
