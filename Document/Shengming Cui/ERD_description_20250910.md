# ERD Documentation & Review Notes (Revised)

## 1. Core Entities

* **User**: Main system actor. Stores account details (username, email, phone, profile picture), authentication (password hash), timestamps, and last login.
* **SecurityQuestion**: System-defined or user-defined recovery questions.
* **UserSecurityAnswer**: Links a User to chosen SecurityQuestions with a hashed answer.
* **Category**: Defines spending categories (Food, Transport, etc.). Used in expenses, recurring schedules, and goals.
* **ExpenseRecord**: Individual expense log. Includes amount, currency, date, payment method, description, and optional link to a RecurringSchedule.
* **RecurringSchedule**: Defines repeating expenses (rent, subscriptions). Includes amount, frequency, start/end dates, and payment method.
* **RecurringScheduleFrequency**: Lookup table for frequencies (e.g., weekly, monthly).
* **Goal**: Budget or savings targets, tied to a Category or overall scope. Includes type, target amount, currency, and active period.
* **GoalPeriodType**: Lookup table for goal periods (e.g., monthly, yearly).
* **FeatureSnapshot**: Monthly aggregated spending summary per user. Stores overall totals and links to breakdowns.
* **FeatureSnapshotByCategory**: Stores per-category spending totals for a given snapshot.
* **Recommendation**: AI- or rule-based suggestions generated from FeatureSnapshots. Includes summary and status.
* **Achievement**: Defines gamified milestones with name, description, icon, and criteria.
* **UserAchievement**: Tracks unlocked achievements per user (composite key `(user_id, achievement_id)`).
* **ExchangeRate**: Currency conversion table with base/target currencies, rate, and fetch timestamp.

---

## 2. Key Relationships

* **User → UserSecurityAnswer**: One-to-many. A user may answer multiple security questions.
* **SecurityQuestion → UserSecurityAnswer**: One-to-many. A question may be answered by multiple users.
* **User → ExpenseRecord**: One-to-many. A user creates multiple expense records.
* **User → RecurringSchedule**: One-to-many. A user defines multiple schedules.
* **User → Goal**: One-to-many. A user sets multiple goals.
* **User → FeatureSnapshot**: One-to-many. Snapshots generated per user per month.
* **User → Recommendation**: One-to-many. A user receives multiple recommendations.
* **User → UserAchievement**: One-to-many. A user can earn multiple achievements.
* **Category → ExpenseRecord / RecurringSchedule / Goal**: Categories applied to expenses, schedules, and goals.
* **RecurringSchedule → ExpenseRecord**: One-to-many. A schedule generates recurring expense records.
* **RecurringSchedule → RecurringScheduleFrequency**: One-to-many. Frequency is selected from lookup.
* **Goal → GoalPeriodType**: One-to-many. Goal period is selected from lookup.
* **FeatureSnapshot → FeatureSnapshotByCategory**: One-to-many. Snapshot stores breakdown per category.
* **FeatureSnapshot → Recommendation**: One-to-many. Recommendations generated based on snapshot.
* **Achievement → UserAchievement**: One-to-many. Achievements unlocked by users.

---

## 3. Design Features

* **Composite Keys**: `UserAchievement` uses `(user_id, achievement_id)` to avoid duplicates.
* **Lookup Tables**: `RecurringScheduleFrequency` and `GoalPeriodType` enforce controlled vocabularies.
* **Normalization**: Security Q\&A split into `SecurityQuestion` (master) and `UserSecurityAnswer` (user mapping).
* **Historical Tracking**: `ExpenseRecord`, `ExchangeRate`, and snapshots include timestamps for traceability.
* **Extensibility**: Isolated `ExchangeRate` and `FeatureSnapshotByCategory` make financial analysis extendable.
