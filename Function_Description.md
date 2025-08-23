## 2. User Registration

### Function Overview
Allows new users to create an account in order to access the full features of the expense tracking application.

### Function Details

- Users can register via **email** or **Google account**.  
  When registering with a Google account, the system automatically uses the associated Gmail address as the registered email.

- The registration form includes the following fields:
    - Username
    - Password
    - Confirm Password
    - Email Address
    - Verification Code

- The **email address** is validated using regular expressions to ensure proper format.

- The **password** must meet strength requirements:
    - Minimum of 8 characters
    - Must include both **letters** and **numbers**

- During registration, the system automatically checks whether the chosen **username** or **email** is already in use and displays a prompt if a conflict is detected.

- After submitting the registration form, users are required to **activate their account via email verification**.





## 8. View/Search Transactions

### Function Overview
Allows users to view their own expense records, with options to filter, sort, and search as needed.

### Function Details

- Supports filtering by **time range**, including:
    - Today
    - This week
    - This month
    - Custom date range

- Supports filtering by **expense category**, such as:
    - Food & Dining
    - Transportation
    - Shopping
    - Medical
    - Others

- Supports **keyword search**, e.g., entering "coffee" will return all transactions containing that keyword in the description.

- Supports **amount range filtering** and **sorting**:
    - Filter by minimum and maximum amounts
    - Sort by amount in ascending or descending order

- Supports **pagination**, with a default number of records displayed per page.

- Each transaction record displays the following fields:
    - Date
    - Expense item
    - Category
    - Amount
    - Notes
    - Recurrence status (e.g., fixed/recurring expense)

## 9. Generate Expense Reports

### Function Overview
Generates statistical reports based on the user's historical expense data to help them understand spending trends and patterns.

### Function Details

- **Report Types**:
    - Monthly / Quarterly / Yearly reports
    - Category-based expense analysis (e.g., proportion spent on dining, entertainment, etc.)
    - Time-based trend charts (e.g., daily or weekly spending changes)

- **Chart Visualizations**:
    - Pie charts
    - Bar charts
    - Line charts

- **Export Options**:
    - Reports can be exported as **PDF** or **Excel** files
    - Option to send reports via **email**

- **Report Content Includes**:
    - Total spending amount
    - Category and date with the highest spending
    - Comparison with previous periods (e.g., last month or last quarter)
    - Whether the spending exceeded the set budget goals

- If the user has defined spending goals or preferred reporting dimensions, the system will automatically include comparative analysis in the report.


## 4.Page Settings (Dark/Light & Dyslexia‑Friendly Font)

### Description

Provide per-user appearance & accessibility settings. If a row does not exist for a user, return defaults without inserting.

###  Actors
User (authenticated)
System (settings service + repository)

###  Data Model

Entity: UserSettings
userId (PK; unique per user)
theme ENUM(light|dark|system) — default system
dyslexiaFontEnabled BOOLEAN — default false
updatedAt TIMESTAMP
updatedBy ENUM(user|system)


### User Requirements (URS)

- URS‑1: Switch between Light/Dark/System with immediate visual change.

- URS‑2: Toggle dyslexia‑friendly font site‑wide and persist the choice.

- URS‑3: If no record exists, defaults are applied (System theme; dyslexia font off).

###  Functional Requirements (FR)

- FR‑1: Repository exposes getOrDefault(userId); if absent, return defaults without inserting.

- FR‑2: Service validates enum/boolean; saving updates updatedAt/updatedBy.

- FR‑3: DB uniqueness: exactly one row per userId.

- FR‑4: Client applies theme/font instantly (root <html> classes; system reads prefers-color-scheme).

### Main Flow

1. Open Settings → Appearance & Accessibility.
2. Call getOrDefault(userId) and render values.
3. User changes theme and/or dyslexia font → preview updates instantly.
4. Save → Service validates & writes → return updated settings.


### User Stories & Acceptance Criteria

- US1: Change ThemeAs a user, I want to switch theme so the UI matches my preference.

  - AC‑1.1: If no record exists, service returns {theme:"system", dyslexiaFontEnabled:false}.

  - AC‑1.2: After saving, subsequent loads show the saved theme.

  - AC‑1.3: theme=system follows OS setting.

- US2: Dyslexia‑Friendly FontAs a user with dyslexia, I want a font that improves readability.

  - AC‑2.1: Toggling applies site‑wide immediately and persists.

  - AC‑2.2: Next login shows the same font state.


## 12. AI Spending Habit Suggestions (Gmini‑assisted)

### Description

Generate monthly spending suggestions from aggregated features (category totals, shares). Optionally call Gmini to produce natural-language text. Apply rate limiting per user: ≤ 30 requests per 30 minutes. If the limit is exceeded, return 429 Too Many Requests. Store aggregates only and the resulting suggestions; never store transaction line items.

### Actors

User (resource owner)
System (aggregator, suggestion builder, optional LLM client)

### Data Model

Entity: FeatureSnapshot (aggregates only)id, userId, month(YYYY‑MM), totalsByCategory[{cat, amount, pct}], totalSpending, currency, locale, createdAt

Entity: Recommendationid, userId, month, snapshotId, status{ok|no_data}, summary, bullets[{title, detail, cat?, value?}], locale, createdAt, updatedAt

Uniqueness: (userId, month) unique on Recommendation (idempotency).

### User Requirements (URS)

- URS‑1: View suggestions for a selected month with the period clearly labelled.

- URS‑2: Trigger generation for a selected month.

- URS‑3: If no transactions exist for the month, show an “insufficient data” summary and no bullets.

- URS‑4: Re‑generating for the same (user, month) updates the existing recommendation (no duplicates).

- URS‑5: Access control: only the owner can read/generate; unauthenticated requests are denied.

### Functional Requirements (FR)

- FR‑1: Aggregator computes totals & percentages per category and top‑N categories.

- FR‑2: Rule engine produces bullets from aggregates (e.g., high‑share categories, spikes vs trailing average).

- FR‑3: If LLM is enabled, send aggregates only to produce summary; otherwise use rules-only text.

- FR‑4: Upsert by (userId, month); update updatedAt on regeneration.

- FR‑5: Rate limit: per user ≤ 30 requests/30 minutes; on exceed → 429 with wait‑hint.

- FR‑6: Authorization: owner‑only (401/403 on failure).

### Main Flow

User selects a month (default: current month).

System builds or retrieves a FeatureSnapshot.

If no spend exists, create Recommendation with status=no_data and empty bullets.

Otherwise (and within rate limit), optionally call Gmini for summary or use rules-only.

Upsert Recommendation and return.


### User Stories & Acceptance Criteria

- US1: View Monthly Suggestions

AC‑1.1: Response includes month=YYYY‑MM and category aggregates only.

- US2: Generate Suggestions for a Month

AC‑2.1: POST /api/suggestions:generate {month} returns a Recommendation.

AC‑2.2: Re‑generation updates the existing record (timestamps change).

- US3: Rate Limiting

AC‑3.1: The 31st request within a 30‑minute window returns 429 with a message indicating remaining wait time.



## 13. Spending Goal Feedback Report


### Description

Users create budget or savings goals and generate monthly feedback reports: progress toward target, variance (actual − target), and a forecast (on_track | at_risk | off_track). Store only aggregates/snapshots.

### Data Model

Entity: Goalid, userId, type{budget|savings}, scope{overall|category}, category?, targetAmount, currency, periodType{monthly|rolling|custom}, startAt?, endAt?, createdAt, updatedAt

Entity: GoalReportid, goalId, month(YYYY‑MM), progressPct, varianceAmount, forecast{on_track|at_risk|off_track}, headline, details{progress, variance, actions[]}, snapshotId, createdAt, updatedAt

Uniqueness: (goalId, month) unique on GoalReport (idempotency).

### User Requirements (URS)

URS‑1: Users can create/manage their own goals with required fields validated.

URS‑2: Users can generate a monthly report for a goal; the applicable month is clearly shown.

URS‑3: Each report shows a headline, progress %, variance, and forecast with suggested actions.

URS‑4: If a month has no relevant transactions, create a report with zero progress and an “insufficient data” note (forecast per policy).

URS‑5: Re‑generating for the same (goal, month) updates the existing report (no duplicates).

### Functional Requirements (FR)

- FR‑1: Validate goal payload: enums valid; targetAmount > 0; supported currency.

- FR‑2: Progress calculations:
budget goals: show % of target spent (or an equivalent clearly stated metric).
savings goals: progress = actualSaved / targetAmount.

- FR‑3: Variance = actual − target (signed); label over/under.

- FR‑4: Forecast rules (example):
on_track: projection within target ± small buffer;
at_risk: projection breaches by ≤10%;
off_track: projection breaches by >10%.

- FR‑5: Upsert by (goalId, month); update updatedAt on regeneration.

- FR‑6: Optional LLM may craft headline/actions from aggregates; otherwise use deterministic rules.

- FR‑7: Authorization: owner‑only for CRUD and generation.

### Main Flow

User creates a Goal (budget or savings).
User selects a month and clicks Generate Report.
System aggregates data, computes progress/variance/forecast, creates or updates GoalReport.
Optionally call LLM to refine headline/actions; else use rules.
Return the report for display.


### User Stories & Acceptance Criteria

US1: Create Goal

AC‑1.1: Missing/invalid fields are rejected with clear messages.

AC‑1.2: Only the owner can CRUD the goal.

US2: Monthly Report

AC‑2.1: Report shows headline, progressPct, varianceAmount, and forecast.

AC‑2.2: The month (YYYY‑MM) is clearly indicated in both UI and API.

US3: No Data / Regenerate

AC‑3.1: No relevant transactions → zero progress + “insufficient data”.

AC‑3.2: Re‑generation updates the existing (goal, month) report (no duplicates).

