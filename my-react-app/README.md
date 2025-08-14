# Personal Finance and Budget Tracker
Finance web app for managing your daily expenditures, personal finances, and expense tracking with AI recommended advices.
Key features from this project includes secure login system, a dashboard with clear overview


## Table of Contents
1. [Login/Sign Up Navigation](#1-login-sign-up-navigation-page)
2. [Dashboard (Home Page)](#2-dashboard-home-page)
3. [History](#3-history)
4. [Expense Tracking](#4-expense-tracking)
5. [AI Recommendation Chat](#5-ai-recommendation-chat)
6. [Saving Goals](#6-saving-goals)
7. [Analytics of current data](#analytics-of-current-data)
8. [Settings](#settings)
9. [Tech Stack](#tech-stack)
10. [Key Features](#key-features-high-level-goals)
11. [Team Roles and Responsibilities](#team-roles-and-responsibilities)


## 1. Login/Sign up navigation page
- User authentication (sign up, login)
- Secure password handling (bcrypt) to prevent data breaches
- JWT tokens for secure user sessions
- Implementing caching to improve performance and reduce loading times

## 2. Dashboard (Home page)

- **Monthly Overview**
  - Add new transaction easily
  - Track progress towards savings goals

## 3. History

- View a table of all historical transactions
- Ability to add new transactions directly from history

## 4. Expense Tracking

- Visualize spending with a pie/bar chart
- Get a quick overview of which categories the all the expenses have been to

## 5. AI Recommendation Chat

- Integrates with the Gemini API to provide tailored financial recommendations based on user's data within the web app
- Includes a chat interface for real-time conversations and a chat history page to review previous interactions and advices.

## 6. Saving goals

- Set targeted savings goals
- Monitor progress on each goals

## Analytics of current data

- Detailed breakdown and analysis for each goal
- Insights into spending and saving patterns

## Settings

- Edit profile information
- Change password
- Adjust monthly budget restrictions

# Tech Stack
- **Frontend:** React
- **Backend:** Node.js
- **Database:** PostgreSQL
- **Related APIs:** (to be decided)

## Key features
- AI integrated recommendations (Gemini API / prompt engineering)
- Pop up notifications regarding overspending
- Secure user auth and password hashing for privacy concerns
- Visual analysis (pie / bar charts) for spending and savings overview
- Filtering option for transaction history
- Customizable saving goals and progress tracking
- Responsive UI/UX webapp for various devices (phones, tablets, laptops)
- Option to import data (previous spending/savings data)

## Team Roles and Responsibilities
- **Mingxiang Zhang:**
Frontend development, assisting with UI components and user interaction features. Also responsible for testing frontend functionality to ensure quality and reliability.

- **Ellis Mon:**
Frontend development, including implementing user interfaces and ensuring a seamless user experience. Also manages project tasks and progress using Jira.

- **Shengming Cui:**
Backend development, focusing on server-side logic and database integration. Acts as the project tracker, maintaining clear and consistent git commit messages and managing pull requests.

- **Bing Zhou:**
Backend development, implementing APIs, server logic, and SQL/database operations. Also performs backend testing to verify system stability and performance.

- **Yuchuan Hu:**
Backend development, focusing on database operations and API integration. Responsible for backend testing and ensuring data integrity.
