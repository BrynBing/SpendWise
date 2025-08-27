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