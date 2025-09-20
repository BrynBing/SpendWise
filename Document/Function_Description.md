## 1. User Login

### Function Overview

Provides secure authentication for users to access the app.

### Functional Details

- The system shall user to access their accounts securely through logging in with a registeres email and password to access the full features of the expense tracking application.

- The system shall validate users credentials, if the credentials are valid, the system grants access.

- The system shall deny access, shows an error pop up message with "invalid credentials", and prompts for retry when invalid credentials are entered.

- The system shall take users to reset password security questions to reset user's password, when "Forgot Password" is selected.

- The system shall keep users signed in until they manually log out or their session expires.

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

## 3. Password Reset

### Function Overview

Provides a security question–based recovery method for users who forget their password.

### Functional Details

- The system shall allow users to reset their password when they forget it by answering their pre-set security questions.

- The system shall require users to provide their username or partial identifying information before presenting the security questions.

- The system shall present 2–3 previously saved security questions to the user.

- The system shall validate the answers to the security questions. If all answers are correct, the system shall allow the user to create a new password that complies with the password policy. If any answer is incorrect, the system shall display “Verification failed” and deny progress.

- The system shall lock the password reset function for 30 minutes after 3 consecutive failed attempts.

- The system shall revoke all current active sessions once the password is reset successfully.

- The system shall display a success confirmation message and log the reset event.

- The system shall log all password reset attempts (including timestamp, IP address, and question IDs, but not the actual answers).

## 4.Page Settings (Dark/Light & Dyslexia‑Friendly Font)

### Description

Provide per-user appearance & accessibility settings. If a row does not exist for a user, return defaults without inserting.

### Actors

User (authenticated)
System (settings service + repository)

### Data Model

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

### Functional Requirements (FR)

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

## 5. Modify Personal Information

### Description

Allow authenticated users to view and update their personal profile information, ensuring proper validation and security controls.

### Actors

- **User** (authenticated)
- **System** (profile service + repository)

### Data Model

**Entity:** UserProfile

- userId (PK; unique per user)
- username STRING (immutable; unique)
- email STRING (unique; validated)
- phoneNumber STRING (optional; validated format)
- profilePictureURL STRING (optional)
- updatedAt TIMESTAMP

### User Requirements (URS)

- **URS-1:** View current personal profile (username, email, phone, profile picture).
- **URS-2:** Update editable fields (email, phone, profile picture).
- **URS-3:** Require re-authentication (enter current password) before saving for security.
- **URS-4:** Input validation (email format, phone format, file size/type for picture).
- **URS-5:** Persist changes and reflect immediately in UI.

### Functional Requirements (FR)

- **FR-1:** Repository exposes `getProfile(userId)` and `updateProfile(userId, payload)`; validates all inputs.
- **FR-2:** Email uniqueness enforced; reject if duplicate.
- **FR-3:** Profile picture upload: validate file size ≤2MB; allowed formats JPG/PNG.
- **FR-4:** Save changes updates `updatedAt` and `updatedBy`.
- **FR-5:** Authorization: only owner can CRUD own profile; unauthorized → 401/403.
- **FR-6:** All updates logged for audit.

### Main Flow

1. Open Profile Settings page.
2. Call `getProfile(userId)` to load current data.
3. User edits allowed fields.
4. On Save:
   - System prompts current password for verification.
   - Validate inputs.
   - Persist changes.
5. Return updated profile; UI reflects changes immediately.

### User Stories & Acceptance Criteria

- **US1: View Profile**
  - **AC-1.1:** API returns username, email, phone, profilePictureURL.
  - **AC-1.2:** Unauthorized request → 401.

- **US2: Update Profile**
  - **AC-2.1:** Invalid email/phone/file rejected with clear error.
  - **AC-2.2:** Valid changes persist; subsequent loads reflect updated data.
  - **AC-2.3:** Require current password; missing/wrong password → reject.

## 6. Manage Expense Records

### Function Overview

Provides users the ability to record, edit, and delete expense entries.

### Functional Details

- The system shall allow users to **create** a new expense record by entering details such as: amount, category, date, payment method, and notes.

- The system shall allow users to **edit** existing expense records to update details.

- The system shall allow users to **delete** expense records permanently.

- The system shall store all changes in real time and reflect updates in the user's expense history.

## 7. Scheduled logging

### Function Overview

Supports automatic logging of recurring expenses for consistent spending habits by allowing users to schedule and automate recurring expense entries.

### Functional Details

- The system shall allow users to set up **recurring expense records** for fixed spending habits (e.g., rent, subscriptions, or utility bills).

- The system shall automatically log these recurring expenses at the specified frequency (e.e., daily, weekly, monthly) or on the scheduled date.

- The system shall notify users of upcoming or newly logged recurring expenses.

- The system shall allow users to edit or cancel recurring expense schedules at any time.

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

## 10. Set Spending Goal

### Function Overview

Allows users to define and manage personalized spending or saving goals by category, amount, and time period.

### Functional Details

- The system shall allow users to create a new spending goal by selecting a category (e.g., Food, Transport, Entertainment, Overall), entering a target amount, and specifying a time period (weekly, monthly, or yearly).

- The system shall save the spending goal once all required details are entered correctly.

- The system shall confirm successful creation of the goal with a success message.

- The system shall display all saved goals in the user’s list of active goals.

- The system shall validate all goal inputs before saving: Amount must be positive and greater than the minimum threshold (e.g., > $1). Category must be chosen from the system’s predefined list. Duplicate goals for the same category and time period must be prevented or require explicit user confirmation.

- The system shall display appropriate error messages if invalid inputs are provided, and shall not save the goal until corrected.

## 11. Track Spending Goal

### Function Overview

Allows users to track their expenses against previously set spending goals. The system calculates progress, displays remaining budget, and provides alerts when users are nearing or exceeding their goals.

### Functional Details

- The system shall compare all recorded expenses against the user’s active spending goals.

- The system shall calculate and display goal progress (e.g., “$150 spent of $200 goal = 75%”).

- The system shall show remaining budget for each active goal.

- The system shall visually represent progress through indicators (e.g., bar charts, percentage, or color codes).

- The system shall support tracking multiple active goals simultaneously.

- The system shall provide alerts when: Spending reaches or exceeds 80% of the goal (warning alert). Spending exceeds 100% of the goal (over-budget alert).

- The system shall ensure alerts are clear but non-intrusive (e.g., pop-ups or dashboard badges).

- The system shall log all alerts for future reference, including timestamp and related goal.

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

## 14. Achievements List

### Description

Gamified feature that tracks and displays user achievements/milestones in expense management.

### Actors

- **User** (authenticated)
- **System** (achievement service + repository)

### Data Model

**Entity:** Achievement

- achievementId (PK)
- name STRING
- description STRING
- iconURL STRING
- criteria JSON (rules to unlock)

**Entity:** UserAchievement

- userId (PK composite with achievementId)
- achievementId (FK)
- earned BOOLEAN
- earnedAt TIMESTAMP

### User Requirements (URS)

- **URS-1:** View list of achievements (earned and locked).
- **URS-2:** Each achievement shows name, description, icon, earned date if applicable.
- **URS-3:** Auto-update earned achievements based on user activity (expense logs, goals).
- **URS-4:** Filter by earned/locked.
- **URS-5:** Notify user when a new achievement is unlocked (optional).

### Functional Requirements (FR)

- **FR-1:** Repository provides `listAchievements(userId)` merging static definitions + user earned status.
- **FR-2:** Criteria engine updates UserAchievement when criteria met.
- **FR-3:** Earned achievements set `earned=true` and timestamp.
- **FR-4:** Read-only for users; criteria evaluated by system.
- **FR-5:** Notifications triggered on newly earned.

### Main Flow

1. User navigates to Achievements Dashboard.
2. System retrieves all achievements with earned status.
3. User filters by earned/locked if desired.
4. New achievements unlocked auto-notify user.

### User Stories & Acceptance Criteria

- **US1: View Achievements**
  - **AC-1.1:** API returns full list with earned flags.
  - **AC-1.2:** Earned entries include earnedAt date.

- **US2: Unlock Achievement**
  - **AC-2.1:** Criteria engine marks earned, persists with timestamp.
  - **AC-2.2:** User receives notification (if enabled).

## 15. Currency Exchange Calculator

### Description

Provides real-time currency conversion between multiple supported currencies using up-to-date exchange rates.

### Actors

- **User** (authenticated)
- **System** (exchange service + external API)

### Data Model

**Entity:** ExchangeRate

- baseCurrency STRING (ISO 4217)
- targetCurrency STRING (ISO 4217)
- rate DECIMAL
- fetchedAt TIMESTAMP

**Entity:** ExchangeRequest (optional, for logs)

- requestId PK
- userId
- amount DECIMAL
- baseCurrency
- targetCurrency
- convertedAmount DECIMAL
- rateUsed DECIMAL
- requestedAt TIMESTAMP

### User Requirements (URS)

- **URS-1:** User selects source currency, target currency, and amount.
- **URS-2:** System returns converted amount and last updated timestamp.
- **URS-3:** Support major currencies; easily extendable.
- **URS-4:** Cache rates (e.g., 30 min) to reduce API calls.
- **URS-5:** Handle API failures gracefully with error or fallback cached data.

### Functional Requirements (FR)

- **FR-1:** Validate inputs: amount >0; currency codes valid.
- **FR-2:** Fetch exchange rates from trusted provider; cache with TTL.
- **FR-3:** Conversion formula: convertedAmount = amount \* rate.
- **FR-4:** API error handling: fallback to cached rate; else return error.
- **FR-5:** Authorization: only authenticated users can access.
- **FR-6:** Rate responses include timestamp of rate used.

### Main Flow

1. User opens Currency Calculator.
2. Inputs source currency, target currency, amount.
3. System retrieves latest cached or API rate.
4. Calculates converted amount; returns with rate and timestamp.
5. Display in UI.

### User Stories & Acceptance Criteria

- **US1: Convert Currency**
  - **AC-1.1:** Valid request returns convertedAmount, rateUsed, fetchedAt.
  - **AC-1.2:** Invalid input returns 400 with clear message.

- **US2: API Failure Handling**
  - **AC-2.1:** If API fails, fallback to cached rate if available.
  - **AC-2.2:** If no cache, return error message.
