# JobPulse Live — Selenium UI Automation Report

## 1. Objective

Selenium WebDriver with Java was introduced to automate critical UI workflows of JobPulse Live.

**Automation Environment:**
- **Language:** Java
- **Automation Tool:** Selenium WebDriver
- **Build Tool:** Maven
- **Browser:** Google Chrome
- **Driver Management:** Selenium Manager / ChromeDriver
- **Application Under Test:** JobPulse Live
- **URL:** http://127.0.0.1:5000

## 2. Selenium Setup Validation

The following environment and tooling setup was successfully validated:

- Java 22.0.2
- Apache Maven 3.10.0
- Selenium Java dependency 4.27.0
- JUnit Jupiter dependency 5.11.4
- Chrome launched successfully through ChromeDriver
- JobPulse local application loaded successfully

*Note:* The Maven project initially reported "No tests to run" before the first Java Selenium program was created. The Selenium program was subsequently created and executed successfully. This initial output was an environment setup detail, not an application defect.

## 3. Executed Selenium Tests

Only the following verified executions were conducted:

### Selenium Test 1 — Launch Application and Read Page Title

- **Purpose:** Verify that Selenium can launch Chrome and load JobPulse Live.
- **Actions:**
  1. Launch Chrome using ChromeDriver.
  2. Navigate to `http://127.0.0.1:5000`.
  3. Read the page title.
  4. Close the browser.
- **Expected:** JobPulse application loads successfully and the page title is returned.
- **Actual:** Chrome launched successfully, JobPulse loaded successfully, and the page title printed was:  
  `"JobPulse Live - Track. Apply. Prepare. Get Hired."`
- **Status:** PASS

### Selenium Test 2 — Enter Search Keyword

- **Purpose:** Verify that Selenium can locate the JobPulse search field and enter a search term.
- **Actions:**
  1. Open JobPulse.
  2. Locate the element using: `By.id("searchInput")`.
  3. Enter "QA Tester".
- **Expected:** "QA Tester" should appear in the search field.
- **Actual:** Selenium successfully located `searchInput` and typed "QA Tester".
- **Status:** PASS

### Selenium Test 3 — Click Search Button

- **Purpose:** Verify that Selenium can trigger the JobPulse search action.
- **Actions:**
  1. Enter "QA Tester".
  2. Locate the search button using: `By.id("searchButton")`.
  3. Click the button.
- **Expected:** Search button should be successfully clicked.
- **Actual:** Selenium successfully located `searchButton` and clicked it.
- **Status:** PASS

### Selenium Test 4 — Verify Job Results Container

- **Purpose:** Verify that the job results section becomes visible after performing a search.
- **Actions:**
  1. Open JobPulse.
  2. Enter "QA Tester".
  3. Click Search.
  4. Locate the element using: `By.id("jobList")`.
  5. Check visibility using `isDisplayed()`.
- **Expected:** The job results section should be visible.
- **Actual:** The `jobList` element was located successfully and confirmed visible.
- **Console Output:** `PASS: Job results are visible.`
- **Status:** PASS

## 4. Combined End-to-End Flow

The following end-to-end flow was successfully automated and verified:

```text
Open Chrome
  → Open JobPulse (http://127.0.0.1:5000)
  → Enter "QA Tester" into #searchInput
  → Click Search (#searchButton)
  → Verify job results section (#jobList) is visible
  → Print page title
  → Close browser
```

- **Execution Result:** PASS
- **Errors:** 0
- **Exit Code:** 0

## 5. Important Learning / Automation Concepts Demonstrated

The following Selenium WebDriver concepts were actively implemented and verified in the automated suite:

- `WebDriver`
- `ChromeDriver`
- `driver.get()`
- `By.id()`
- `findElement()`
- `sendKeys()`
- `click()`
- `isDisplayed()`
- `getTitle()`
- `driver.quit()`

*Note:* `findElements(By.id("jobCard"))` was not included in this executed suite and is reserved for future job card count validation.

## 6. Current Automation Coverage

**Completed UI Automation Coverage:**
- Application launch & navigation
- Search input interaction
- Search button interaction
- Search result container visibility

**Planned / Future Automation (Not Yet Completed):**
- Multiple keyword data sets
- Location filter automation
- Category filter automation
- Job details automation
- Track job automation
- Application stage automation
- Edit/delete automation
- Cross-browser automation
- JUnit-based test assertions
- Full regression automation suite

## 7. Automation Notes

- **Class Name & Filename Mismatch:** The first Selenium execution initially encountered a Java filename/class-name mismatch because the file was named `FirstSelTest.java` while the public class was defined as `FirstSeleniumTest`. This was resolved by saving the file with the matching name `FirstSeleniumTest.java`.
- **Import Typo Correction:** A subsequent import typo for ChromeDriver was corrected to `org.openqa.selenium.chrome.ChromeDriver`.
- **Execution Verification:** Following these corrections, the Selenium tests executed cleanly to completion with exit code 0. These were minor setup/code syntax corrections and not application defects.

## 8. Summary

Selenium UI automation has been successfully established for JobPulse Live using Java and Maven. The core end-to-end search workflow—from launching the application to submitting a keyword query and verifying result container visibility—has been fully automated and verified.

Report prepared from actual Selenium UI automation execution performed during QA validation of JobPulse Live.
