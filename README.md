# Expense Manager (Front End Engineering-II | 25CSE0203)

A production-grade personal finance Single-Page Application (SPA) built with **React 19 + Vite + Redux Toolkit + React Router v7 + Context API**.

This project has been engineered to align with the **Front End Engineering-II Project Evaluation Rubrics**:
1. **React Navigation Layout and Page Structure** (Nested layout route with `<Outlet />`, `<NavLink>`, active states, programmatic navigation, query parameters).
2. **Context API and State Architecture** (Clean separation between cross-cutting UI/notification state via Context API and domain/business state via Redux Toolkit).
3. **Redux Toolkit** (Centralized store with `configureStore`, `transactionsSlice`, and `budgetSlice` with Immer reducers, actions, and selectors).
4. **Form Handling in React** (Controlled inputs via custom `useForm` hook, real-time touch tracking, per-field validation error indicators, multi-input forms, category budget forms, and JSON import/export validation).

---

## 🛠️ Tech Stack

- **UI & Core:** React 19 (`^19.2.8`), React DOM (`^19.2.8`)
- **Navigation & Routing:** React Router v7 (`react-router-dom ^7.18.4`)
- **State Architecture:**
  - **Redux Toolkit (`@reduxjs/toolkit ^2.13.0` & `react-redux ^9.3.0`)**: Domain state (`transactions`, `budgets`, `savingsGoal`, `monthlyTargetRate`).
  - **React Context API**: Cross-cutting presentation state (`ThemeContext`, `ToastContext`, `ModalContext`).
- **Form Handling:** Custom hook `useForm` with touch tracking, dirty state detection, and live field validation.
- **Styling:** Pure Vanilla CSS with CSS Custom Properties (zero external CSS frameworks). Full Light/Dark mode support.
- **Persistence:** Local Storage API with safe error-boundary handling.
- **Linter & Build:** Vite 8, Oxlint (0 warnings, 0 errors).

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

To verify linting:
```bash
npm run lint
# or: npx oxlint src
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 🏛️ Architecture Breakdown

### 1. State Architecture: Context API vs. Redux Toolkit

The application employs a deliberate state architecture:

| State Concern | Managed By | Purpose / Responsibilities |
| :--- | :--- | :--- |
| **Theme State** | `ThemeContext` (`useTheme`) | Controls `"light"` vs `"dark"` mode, toggles `html.dark`, persists to `localStorage`. |
| **Notification / Toasts** | `ToastContext` (`useToast`) | Global alert mechanism providing auto-dismissing notifications for user actions (create, edit, delete, backup). |
| **Modal State** | `ModalContext` (`useModal`) | Manages open/close state and editing payloads for the transaction modal across any route. |
| **Transactions Ledger** | Redux Toolkit (`transactionsSlice`) | CRUD actions (`addTransaction`, `updateTransaction`, `deleteTransaction`, `clearAllTransactions`, `importTransactions`), state selectors, and local storage sync. |
| **Budgets & Goals** | Redux Toolkit (`budgetSlice`) | Monthly category spending caps, lifetime savings goal, and target savings rate percentage. |

---

### 2. React Router / Navigation Layout & Page Structure

Routes are organized hierarchically with a master `RootLayout` enclosing an `<Outlet />`:

```
/                -> Dashboard (executive overview, recent transactions, quick stats)
/transactions    -> Transactions Ledger (search, filter by type/category/date/amount, 6-way sort)
/budgets         -> Category Budgets (NEW: monthly category limits, spent vs limit progress bars)
/analytics       -> Analytics (Overview charts + 12-month Savings rate tracker)
/settings        -> Settings (Theme toggle, JSON Backup Export & Restore Form, Data Reset)
*                -> 404 Not Found (graceful fallback with programmatic navigation back to /)
```

- **Active Links:** `<NavLink>` dynamically applies `.active` class to current routes in the top sticky `<Navbar />`.
- **Query Parameters:** `useSearchParams` is used in `/transactions?search=...&type=...` for deep linking and filter sharing.
- **Programmatic Navigation:** `useNavigate` powers redirections on 404 pages and action flows.

---

### 3. Form Handling (`useForm` Hook)

Forms across the application are built using a reusable custom hook (`src/hooks/useForm.js`):
- **Controlled Components:** Every input value is tracked in React state.
- **Field-Level Validation:** Specific rules for required fields, min/max values, positive numeric amounts, and character limits.
- **Touch Tracking:** Errors display only after user interaction (`onBlur`) or upon form submission.
- **Multiple Input Types:**
  - Text & Numeric inputs (with bounds)
  - Date picker
  - Select dropdowns (Category, Payment Method, Tag)
  - Textarea with live character counter (`0 / 150`)
  - Segmented toggle controls (`TypeSwitch`)
  - File input with client-side JSON schema validation (Data Restore)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── BudgetCard.jsx           # Category spending progress card with status badges
│   ├── BudgetForm.jsx           # Category budget limit form with useForm validation
│   ├── Chart.jsx                # Zero-dependency HTML/CSS horizontal & vertical bar chart
│   ├── ChartCard.jsx            # Card container encapsulating Chart
│   ├── EmptyState.jsx           # Reusable empty-state display with action button
│   ├── FilterPanel.jsx          # Multi-criteria filter drawer for transactions
│   ├── IncomeVsExpenseCard.jsx  # Net cash flow comparison card
│   ├── MonthlyTargetCard.jsx    # 12-month savings performance table with status badges
│   ├── MonthlyTrendTable.jsx    # Month-by-month financial history table
│   ├── Navbar.jsx               # Navigation bar with NavLink and theme toggle
│   ├── QuickStats.jsx           # 4-metric statistics summary
│   ├── RecentTransactions.jsx   # Top 5 most recent transactions card
│   ├── SavingsGoalCard.jsx      # Lifetime savings goal progress bar
│   ├── SearchBar.jsx            # Search input, sort dropdown, and filter trigger
│   ├── StatCard.jsx             # Key metric card with semantic colors and icons
│   ├── ToastContainer.jsx       # Floating notifications driven by ToastContext
│   ├── TransactionForm.jsx      # Modal form with controlled inputs & live validation
│   ├── TransactionItem.jsx      # Single transaction item with payment method and tags
│   ├── TransactionList.jsx      # Transaction list mapper or empty state
│   └── TypeSwitch.jsx           # Expense vs Income toggle button
├── context/
│   ├── ThemeContext.js          # Theme Context definition and useTheme hook
│   ├── ThemeProvider.jsx        # ThemeProvider component
│   ├── ToastContext.js          # Toast Context definition and useToast hook
│   ├── ToastProvider.jsx        # ToastProvider component
│   ├── ModalContext.js          # Modal Context definition and useModal hook
│   └── ModalProvider.jsx        # ModalProvider component
├── hooks/
│   └── useForm.js               # Reusable controlled form hook with validation
├── layouts/
│   └── RootLayout.jsx           # Master navigation shell with Navbar, Outlet, Toast, Modal
├── pages/
│   ├── Analytics.jsx            # Analytics dashboard (Overview & Savings tabs)
│   ├── Budgets.jsx              # Category Budget Management page (NEW)
│   ├── Dashboard.jsx            # Financial overview and quick actions
│   ├── NotFound.jsx             # 404 fallback page with useNavigate
│   ├── Settings.jsx             # Appearance, data purge, and JSON Backup & Restore
│   └── Transactions.jsx         # Full searchable and filterable ledger
├── store/
│   ├── index.js                 # Redux Toolkit store (configureStore)
│   ├── transactionsSlice.js     # Transactions CRUD slice, reducers, and selectors
│   └── budgetSlice.js           # Category budgets, savings goal, and target rate slice
├── utils/
│   ├── helpers.js               # Currency (₹), date formatters, categories, payment methods
│   └── storage.js               # LocalStorage read/write and sample seed data
├── App.jsx                      # Router & Context provider composition
├── main.jsx                     # Root React entry point with Redux Provider
└── style.css                    # Complete CSS stylesheet (Light & Dark theme variables)
```

---

## 📋 Viva Presentation Checklist

- [x] **React Navigation / Router:** Explain `RootLayout`, `<Outlet />`, `<NavLink>`, and route structure in [`src/App.jsx`](file:///c:/Users/mrsso/project/src/App.jsx).
- [x] **Context API:** Demonstrate `ThemeContext`, `ToastContext`, and `ModalContext` in [`src/context/`](file:///c:/Users/mrsso/project/src/context/).
- [x] **Redux Toolkit:** Walk through [`src/store/index.js`](file:///c:/Users/mrsso/project/src/store/index.js), `transactionsSlice.js`, and `budgetSlice.js`. Explain `useSelector` and `useDispatch`.
- [x] **Form Handling:** Show [`src/hooks/useForm.js`](file:///c:/Users/mrsso/project/src/hooks/useForm.js), live validation in [`TransactionForm.jsx`](file:///c:/Users/mrsso/project/src/components/TransactionForm.jsx), and JSON Backup/Restore validation in [`Settings.jsx`](file:///c:/Users/mrsso/project/src/pages/Settings.jsx).
- [x] **New Functionalities:** Show the **Budgets** page ([`src/pages/Budgets.jsx`](file:///c:/Users/mrsso/project/src/pages/Budgets.jsx)) with category spending caps, payment methods, tags, and JSON data backup/restore.
