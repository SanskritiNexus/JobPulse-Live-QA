# JobPulse Live — Defect Report

## 1. Defect Summary

| Bug ID | Title | Area | Severity | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BUG-001 | Job Type Filter Missing | UI / Functional | Medium | Medium | Open |
| BUG-002 | Highest Salary Sorting Incorrect | UI / Functional | Medium | Medium | Open |
| BUG-003 | Job Search API Ignores Keyword | API / Functional | High | High | Open |
| BUG-004 | Job Search API Ignores Category | API / Functional | Medium | Medium | Open |
| BUG-005 | Job Search API Ignores Contract / Job Type | API / Functional | Medium | Medium | Open |
| BUG-006 | Invalid Page Value Silently Falls Back | API / Validation | Low | Low | Open |
| BUG-007 | limit=0 Silently Defaults | API / Validation | Low | Low | Open |
| BUG-008 | Negative Limit Accepted | API / Validation | Low | Low | Open |
| BUG-009 | Large Limit Silently Capped | API / Validation | Low | Low | Open |
| BUG-010 | page=0 Silently Defaults | API / Validation | Low | Low | Open |
| BUG-011 | Negative Page Silently Defaults | API / Validation | Low | Low | Open |
| BUG-012 | Non-numeric Limit Silently Defaults | API / Validation | Low | Low | Open |

## 2. Detailed Defects

### BUG-001 — Job Type Filter Missing

- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** The expected job type filtering functionality is missing.
- **Expected Result:** The user should be able to filter job results by job type.
- **Actual Result:** The job type filter functionality was not available.
- **Source:** Manual UI testing — TC-015.

---

### BUG-002 — Highest Salary Sorting Incorrect

- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** Highest Salary sorting does not return results in the expected descending salary order.
- **Expected Result:** Jobs should be ordered from highest salary to lowest salary.
- **Actual Result:** The returned order was not correctly descending by salary.
- **Source:** Manual UI testing — TC-017.

---

### BUG-003 — Job Search API Ignores Keyword

- **Severity:** High
- **Priority:** High
- **Status:** Open
- **Description:** The job search API did not correctly apply the supplied keyword parameter.
- **Expected Result:** The API should return results relevant to the supplied keyword.
- **Actual Result:** The response did not correctly reflect the supplied keyword/query.
- **Source:** Postman API testing — TC-031.

---

### BUG-004 — Job Search API Ignores Category

- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** The category parameter was not correctly applied by the job search API.
- **Expected Result:** Results should be filtered according to the supplied category.
- **Actual Result:** The category parameter was ignored/not correctly applied.
- **Source:** Postman API testing — TC-034.

---

### BUG-005 — Job Search API Ignores Contract / Job Type

- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** The contract/job type parameter was not correctly applied by the job search API.
- **Expected Result:** Results should be filtered according to the supplied contract/job type.
- **Actual Result:** The contract/job type parameter was ignored/not correctly applied.
- **Source:** Postman API testing — TC-035.

---

### BUG-006 — Invalid Page Value Silently Falls Back

- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** An invalid non-numeric page value such as `page=abc` silently falls back to page 1 instead of being rejected or clearly validated.
- **Expected Result:** Invalid page input should be rejected or return a clear validation response.
- **Actual Result:** The API silently fell back to page 1.
- **Source:** Postman API testing — TC-036.

---

### BUG-007 — limit=0 Silently Defaults

- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** `limit=0` is silently normalized/defaulted instead of being explicitly validated.
- **Expected Result:** An invalid limit value should be rejected or return a clear validation response.
- **Actual Result:** The API silently defaulted the value.
- **Source:** Postman API testing — TC-040.

---

### BUG-008 — Negative Limit Accepted

- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A negative limit such as `-5` is accepted and normalized instead of being rejected through input validation.
- **Expected Result:** A negative limit should be rejected with a clear validation response.
- **Actual Result:** The negative value was accepted and normalized.
- **Source:** Postman API testing — TC-041.

---

### BUG-009 — Large Limit Silently Capped

- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A very large limit such as `1000` is silently capped at 50.
- **Important Clarification:** The existence of a maximum limit is not itself being reported as a defect. The concern is that the capping behavior is silent/undocumented.
- **Expected Result:** The API should either clearly document/enforce the maximum or return an appropriate validation response.
- **Actual Result:** The supplied value was silently capped at 50.
- **Source:** Postman API testing — TC-042.

---

### BUG-010 — page=0 Silently Defaults

- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** `page=0` silently defaults to page 1 instead of being explicitly validated.
- **Expected Result:** An invalid page value should be rejected or return a clear validation response.
- **Actual Result:** The API silently defaulted to page 1.
- **Source:** Postman API testing — TC-043.

---

### BUG-011 — Negative Page Silently Defaults

- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A negative page value such as `-1` silently defaults to page 1.
- **Expected Result:** A negative page value should be rejected or return a clear validation response.
- **Actual Result:** The API silently defaulted to page 1.
- **Source:** Postman API testing — TC-044.

---

### BUG-012 — Non-numeric Limit Silently Defaults

- **Severity:** Low
- **Priority:** Low
- **Status:** Open
- **Description:** A non-numeric limit such as `abc` silently defaults to 10 instead of being explicitly validated.
- **Expected Result:** A non-numeric limit should be rejected with a clear validation response.
- **Actual Result:** The API silently defaulted to 10.
- **Source:** Postman API testing — TC-045.

## 3. Observations — NOT Defects

### OBS-001 — Loosely Related Search Results

During combined search + location testing, some results appeared loosely related to the supplied criteria.

This was treated as an observation and NOT a confirmed defect.

- **Source:** Manual testing — TC-013 / TC-014.

### OBS-002 — Mixed source_name Values

Application records contained mixed `source_name` values, including:
- "Adzuna Demo / PhonePe Careers"
- "Adzuna Demo / Razorpay Careers"
- "Live Job API"
- "Adzuna (IN)"

This was treated as an observation and NOT a confirmed defect.

- **Source:** API testing — TC-024.

## 4. Defect Statistics

- **Total Confirmed Defects:** 12
- **High Severity:** 1
- **Medium Severity:** 4
- **Low Severity:** 7

**Status Breakdown:**
- **Open:** 12
- **Resolved:** 0
- **Closed:** 0

## 5. QA Notes

- Defects were identified through actual manual and API testing.
- Selenium results are documented separately.
- Observations were intentionally not converted into defects without sufficient evidence.
- Duplicate/reconfirmation testing was not counted as a new defect.
- **BUG-009** concerns silent/undocumented capping behavior, not necessarily the maximum limit itself.

Defect report prepared from actual QA test execution results for JobPulse Live.
