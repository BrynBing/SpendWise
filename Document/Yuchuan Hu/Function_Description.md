## 3. User Login

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