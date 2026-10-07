# JobPulse Live — Manual Testing Report

## 1. Testing Scope

Manual testing covered the following functional areas and user flows:
- Application launch
- Job search
- Location and category filtering
- Job details and source links
- Job tracking/application creation
- Application stage updates
- Analytics
- Empty/invalid search
- Pagination
- Sorting
- Employment type
- Duplicate tracking
- Data persistence
- Application editing
- Application deletion

## 2. Test Environment

- **Application:** JobPulse Live
- **Testing Type:** Manual UI / Functional / Negative / Exploratory / Regression-oriented testing
- **Application URL:** http://127.0.0.1:5000
- **Status:** Local development environment

## 3. Test Execution Summary

| Test Case ID | Test Scenario | Status |
| :--- | :--- | :--- |
| TC-001 | Website Launch | PASS |
| TC-002 | Job Search | PASS |
| TC-003 | Location Filter | PASS |
| TC-004 | Category Filter | PASS |
| TC-005 | Job Details + Source Link | PASS |
| TC-006 | Track Job / Create Application | PASS |
| TC-007 | Update Application Stage | PASS |
| TC-008 | Delete Application | PASS |
| TC-009 | Analytics Update | PASS |
| TC-010 | Empty Search | PASS |
| TC-011 | Invalid Search | PASS |
| TC-012 | Pagination | PASS |
| TC-013 | Search + Location Filter Together | PARTIAL / OBSERVATION |
| TC-014 | Search Relevance: QA Tester + Mumbai | PASS / MOSTLY RELEVANT |
| TC-015 | Job Type Filter | FAIL — Missing Feature |
| TC-016 | Sort Latest First | PASS |
| TC-017 | Sort Highest Salary | FAIL — Incorrect descending order |
| TC-018 | Employment Type Display | PASS |
| TC-019 | Duplicate Job Tracking | PASS |
| TC-020 | Application Data Persistence | PASS |
| TC-021 | Edit Application | PASS |
| TC-022 | Delete After Editing | PASS |

## 4. Detailed Test Cases

| Test Case ID | Test Scenario | Expected Result | Actual Result / Observation | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC-001 | Website Launch | Application loads successfully without console or network errors. | Application launched cleanly at http://127.0.0.1:5000. | PASS |
| TC-002 | Job Search | Job search returns relevant job listings matching search query. | Search executed and returned matching job listings. | PASS |
| TC-003 | Location Filter | Filtering by location filters listings to specified location. | Location filtering displayed relevant location results. | PASS |
| TC-004 | Category Filter | Filtering by category filters listings to selected category. | Category filter successfully filtered job listings. | PASS |
| TC-005 | Job Details + Source Link | Job details drawer/modal opens with full details and valid source link. | Job details displayed properly and external source links were accessible. | PASS |
| TC-006 | Track Job / Create Application | Tracking a job adds it to the tracked application list. | Job successfully added to tracked applications. | PASS |
| TC-007 | Update Application Stage | Updating application status/stage updates record accordingly. | Application stage updated successfully. | PASS |
| TC-008 | Delete Application | Deleting a tracked application removes it from the list. | Tracked application was removed successfully. | PASS |
| TC-009 | Analytics Update | Application changes update dashboard analytics in real-time. | Analytics metrics updated accurately upon application changes. | PASS |
| TC-010 | Empty Search | Submitting empty search query handles input gracefully. | System handled empty search cleanly without error. | PASS |
| TC-011 | Invalid Search | Submitting invalid/random search string shows appropriate message. | System handled invalid search gracefully with appropriate response. | PASS |
| TC-012 | Pagination | Pagination controls navigate through result pages correctly. | Successfully navigated between result pages. | PASS |
| TC-013 | Search + Location Filter Together | Combined search query and location filter refine listings accurately. | Combining search + location returned loosely related results in some cases. | PARTIAL / OBSERVATION |
| TC-014 | Search Relevance: QA Tester + Mumbai | Searching for QA Tester in Mumbai returns relevant matches. | Search results were mostly relevant to QA Tester in Mumbai. | PASS / MOSTLY RELEVANT |
| TC-015 | Job Type Filter | Job type filter allows filtering by full-time, part-time, contract, etc. | Expected job type filtering functionality is missing from the UI/API. | FAIL — Missing Feature |
| TC-016 | Sort Latest First | Sorting by Latest First presents newest job listings first. | Job listings sorted chronologically with newest listings first. | PASS |
| TC-017 | Sort Highest Salary | Sorting by Highest Salary orders job listings by salary descending. | Highest Salary sorting does not return results in expected descending salary order. | FAIL — Incorrect descending order |
| TC-018 | Employment Type Display | Job cards display employment type metadata clearly. | Employment type information displayed correctly on job cards. | PASS |
| TC-019 | Duplicate Job Tracking | System handles attempts to track an already tracked job appropriately. | System handled duplicate job tracking attempts properly. | PASS |
| TC-020 | Application Data Persistence | Tracked application data persists across page reloads and browser sessions. | Tracked application data persisted properly. | PASS |
| TC-021 | Edit Application | Edits to tracked application details save and display updated values. | Application edits saved and reflected correctly. | PASS |
| TC-022 | Delete After Editing | Tracked application can be deleted successfully after being edited. | Application successfully deleted after editing. | PASS |

## 5. Confirmed Defects

### BUG-001
- **Title:** Job Type Filter Missing
- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** The expected job type filtering functionality is missing.

### BUG-002
- **Title:** Highest Salary Sorting Incorrect
- **Severity:** Medium
- **Priority:** Medium
- **Status:** Open
- **Description:** Highest Salary sorting does not return results in the expected descending salary order.

## 6. Observations

### OBS-001
- **Description:** Search + location filtering sometimes returned loosely related results. This was treated as an observation and not confirmed as a defect.

### OBS-002
- **Description:** Application records contained mixed `source_name` values, including values such as "Adzuna Demo / PhonePe Careers", "Adzuna Demo / Razorpay Careers", "Live Job API", and "Adzuna (IN)". This was treated as an observation, not a confirmed defect.

## 7. QA Notes

- Core application lifecycle was successfully tested.
- Failed tests above represent either confirmed defects or missing/incorrect functionality.
- Observations are explicitly separated from confirmed defects.
- This report reflects actual manual execution and should not claim unsupported coverage.

Report prepared from actual manual test execution performed during QA validation of JobPulse Live.
