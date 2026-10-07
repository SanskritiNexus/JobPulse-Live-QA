# JobPulse Live — QA Testing Summary

## 1. Project Overview

JobPulse Live is a job discovery and application tracking web application.

The QA validation was performed to evaluate the application's core functionality, REST APIs, negative/boundary behavior, defect handling, and initial UI automation.

## 2. Testing Approach

The project was tested using multiple QA approaches:

- Manual functional testing
- Negative testing
- Boundary testing
- Exploratory / observation-based testing
- Regression-oriented testing
- REST API testing using Postman
- Initial UI automation using Selenium WebDriver with Java

## 3. Test Environment

- **Application:** JobPulse Live
- **Local URL:** http://127.0.0.1:5000
- **UI:** HTML / CSS / JavaScript
- **Backend:** Node.js / Express.js
- **API Testing:** Postman
- **UI Automation:** Selenium WebDriver + Java
- **Build Tool:** Maven
- **Browser:** Google Chrome

## 4. Testing Results

| Testing Area | Coverage / Result |
| :--- | :--- |
| Manual UI / Functional Testing | 22 test cases executed |
| API / Postman Testing | TC-023 through TC-046 executed |
| Selenium UI Automation | 4 verified Selenium executions |
| Confirmed Defects | 12 |
| Observations | 2 |

*Note:* TC-046 was a duplicate/reconfirmation of TC-036 and must not be counted as a separate defect.

## 5. Manual Testing Summary

Manual testing covered:

- Website launch
- Job search
- Location filtering
- Category filtering
- Job details and source links
- Job tracking/application creation
- Application stage updates
- Analytics
- Empty search
- Invalid search
- Pagination
- Search relevance
- Sorting
- Employment type
- Duplicate tracking
- Data persistence
- Editing applications
- Deleting applications

**Manual testing identified:**
- `BUG-001` — Job Type Filter Missing
- `BUG-002` — Highest Salary Sorting Incorrect

**Observations:**
- `OBS-001` — Loosely related search results
- `OBS-002` — Mixed source_name values

Refer readers to:  
[`QA-Testing/Manual-Testing/Manual-Test-Results.md`](file:///c:/Users/Sanskriti%20Tripathi/OneDrive/Desktop/job%20tracker/QA-Testing/Manual-Testing/Manual-Test-Results.md)

## 6. API Testing Summary

API testing using Postman covered:

- Provider status
- Applications GET
- Application POST
- Application PUT
- Application DELETE
- Invalid application ID
- Analytics
- Job search
- Pagination
- Location filtering
- Category filtering
- Contract/job type filtering
- Response structure
- Invalid and boundary parameters

**Confirmed API defects:**
- `BUG-003` — Job Search API Ignores Keyword
- `BUG-004` — Job Search API Ignores Category
- `BUG-005` — Job Search API Ignores Contract / Job Type
- `BUG-006` — Invalid Page Value Silently Falls Back
- `BUG-007` — limit=0 Silently Defaults
- `BUG-008` — Negative Limit Accepted
- `BUG-009` — Large Limit Silently Capped
- `BUG-010` — page=0 Silently Defaults
- `BUG-011` — Negative Page Silently Defaults
- `BUG-012` — Non-numeric Limit Silently Defaults

Refer readers to:  
[`QA-Testing/API-Testing/API-Test-Results.md`](file:///c:/Users/Sanskriti%20Tripathi/OneDrive/Desktop/job%20tracker/QA-Testing/API-Testing/API-Test-Results.md)

## 7. Selenium Automation Summary

Initial Selenium automation was successfully established using Java, Maven and Selenium WebDriver.

**Verified automated UI flow:**
```text
Open Chrome
  → Open JobPulse
  → Enter "QA Tester"
  → Click Search
  → Verify job results section
  → Print page title
  → Close browser
```

**Verified Selenium checks:**
1. Application launch and page title
2. Search input interaction
3. Search button interaction
4. Job results container visibility

All verified Selenium executions completed successfully with exit code 0.

Refer readers to:  
[`QA-Testing/Automation/Selenium-Test-Results.md`](file:///c:/Users/Sanskriti%20Tripathi/OneDrive/Desktop/job%20tracker/QA-Testing/Automation/Selenium-Test-Results.md)

*Important Note:* Location filtering, category filtering, job tracking, application editing/deletion, cross-browser testing, or full regression automation have not yet been automated with Selenium.

## 8. Defect Summary

| Severity | Count |
| :--- | ---: |
| High | 1 |
| Medium | 4 |
| Low | 7 |
| **Total** | **12** |

**Status:**

| Status | Count |
| :--- | ---: |
| Open | 12 |
| Resolved | 0 |
| Closed | 0 |

*Important:* No defects were fixed during this QA documentation phase.

Refer readers to:  
[`QA-Testing/Bug-Reports/Defect-Report.md`](file:///c:/Users/Sanskriti%20Tripathi/OneDrive/Desktop/job%20tracker/QA-Testing/Bug-Reports/Defect-Report.md)

## 9. QA Strengths Demonstrated

The project demonstrates practical experience with:

- Writing and executing test cases
- Functional testing
- Negative testing
- Boundary testing
- REST API testing
- UI testing
- Defect identification
- Severity and priority classification
- API response validation
- Regression-oriented thinking
- Selenium WebDriver automation
- Java and Maven-based automation setup
- Separating confirmed defects from observations

## 10. Current Limitations / Future QA Work

The following items are **NOT YET COMPLETED** and represent future work:

- Larger Selenium regression suite
- JUnit-based automated assertions
- Automated location/category filter tests
- Automated job tracking workflow
- Automated application CRUD workflow
- Cross-browser testing
- Performance/load testing
- Network interruption testing
- Translation testing
- Resource usage testing
- CI/CD integration

## 11. Overall QA Assessment

Based on verified results:

- The core JobPulse lifecycle has been manually validated.
- REST APIs have undergone functional, negative and boundary testing.
- Multiple functional/API defects were identified and documented.
- Initial Selenium UI automation has been successfully established.
- The project demonstrates an end-to-end QA workflow from test execution to defect documentation.
- Some advanced testing areas remain future work.

*Note:* The application is not claimed to be production-ready, and defects remain open to be addressed.

## 12. Documentation Structure

```text
QA-Testing/
├── Manual-Testing/
│   └── Manual-Test-Results.md
├── API-Testing/
│   └── API-Test-Results.md
├── Automation/
│   └── Selenium-Test-Results.md
├── Bug-Reports/
│   └── Defect-Report.md
└── Test-Reports/
    └── QA-Summary.md
```

This QA summary was prepared from actual manual, Postman API, and Selenium UI testing performed on JobPulse Live.
