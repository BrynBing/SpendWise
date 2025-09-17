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
