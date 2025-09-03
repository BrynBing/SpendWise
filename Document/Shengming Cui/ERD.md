# ERD Documentation & Review Notes

## 1. Core Entities

* **User**: Main system actor. Stores account information (username, email), authentication data (password hash), personalization settings (theme, dyslexia font), and status fields (is\_active, last login).
* **SecurityQuestion**: Supports password recovery. Each user may configure multiple questions.
* **Category**: Defines spending categories (e.g., Food, Transport). Used across expenses, recurring schedules, and goals.
* **ExpenseRecord**: Individual expense log with amount, currency, date, payment method, description, and notes. Links to User, Category, and optionally RecurringSchedule.
* **RecurringSchedule**: Defines recurring expenses (rent, subscriptions). Can generate ExpenseRecords on schedule.
* **Goal**: Budget or savings targets. May apply to overall spending or a specific Category, with a target amount and period.
* **FeatureSnapshot**: Monthly aggregated spending features, including totals by category (JSON).
* **Recommendation**: AI- or rule-based spending suggestions, generated from FeatureSnapshots.
* **Achievement**: Defines gamified milestones, with name, description, and criteria stored in JSON.
* **UserAchievement**: Tracks unlocked achievements per user, composite PK `(user_id, achievement_id)`.
* **ExchangeRate**: Stores currency pairs and exchange rates to support currency conversion.

---

## 2. Key Relationships

* **User → SecurityQuestion**: One-to-many. Each user can define multiple recovery questions.
* **User → ExpenseRecord**: One-to-many. A user creates multiple expense records.
* **User → RecurringSchedule**: One-to-many. A user defines multiple recurring schedules.
* **User → Goal**: One-to-many. A user can set multiple goals.
* **User → FeatureSnapshot**: One-to-many. Snapshots generated per user per month.
* **User → Recommendation**: One-to-many. A user receives multiple recommendations.
* **User → UserAchievement**: One-to-many. A user can earn multiple achievements.
* **Category → ExpenseRecord / RecurringSchedule / Goal**: Categories applied to expenses, recurring schedules, and goals.
* **RecurringSchedule → ExpenseRecord**: One-to-many. A schedule generates recurring expense records.
* **Achievement → UserAchievement**: One-to-many. Achievements unlocked by users.
* **FeatureSnapshot → Recommendation**: One-to-many. Snapshots support recommendations.

---

## 3. Design Features

* **Composite Keys**: `UserAchievement` uses `(user_id, achievement_id)` to avoid duplicates.
* **JSON Fields**: Used in `FeatureSnapshot.totals_by_category`, `Recommendation.bullets`, and `Achievement.criteria` to allow flexible business rules without schema changes.
* **Timestamps**: Entities consistently include `created_at` and/or `updated_at` for auditability.
* **Extensibility**: `ExchangeRate` is isolated, making it easy to extend financial functionality in the future.

---

## 4. Open Questions / Assumptions

* **Goals and Category**: Should a Goal always be tied to a Category, or can it represent an overall budget without category linkage?
* **ExchangeRate scope**: Should it store historical time series data, or only the latest snapshot per currency pair?
* **SecurityQuestion policy**: Are questions system-defined (fixed set) or fully user-defined?

