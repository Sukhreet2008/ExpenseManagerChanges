// This file contains simple helper functions for saving and loading
// data from the browser's Local Storage. Local Storage lets a website
// remember data even after the page is refreshed or closed.

const TRANSACTIONS_KEY = "transactions";
const THEME_KEY = "theme";
const SAVINGS_GOAL_KEY = "savingsGoal";
const MONTHLY_TARGET_KEY = "monthlyTargetRate";
const CATEGORY_BUDGETS_KEY = "categoryBudgets";

// A few sample transactions so the app is not completely empty
// the very first time someone opens it.
export const sampleTransactions = [
  {
    id: 1,
    title: "Salary",
    amount: 50000,
    type: "income",
    category: "Salary",
    date: "2026-08-01",
    description: "Monthly salary",
    paymentMethod: "Net Banking",
    tag: "Essential",
  },
  {
    id: 2,
    title: "Groceries",
    amount: 2500,
    type: "expense",
    category: "Food",
    date: "2026-08-03",
    description: "Monthly groceries",
    paymentMethod: "UPI",
    tag: "Essential",
  },
  {
    id: 3,
    title: "Electricity Bill",
    amount: 1800,
    type: "expense",
    category: "Bills",
    date: "2026-08-05",
    description: "Electricity bill for August",
    paymentMethod: "Credit Card",
    tag: "Essential",
  },
  {
    id: 4,
    title: "Freelance Project",
    amount: 8000,
    type: "income",
    category: "Freelance",
    date: "2026-08-08",
    description: "Website project payment",
    paymentMethod: "Net Banking",
    tag: "Work",
  },
  {
    id: 5,
    title: "Movie Night",
    amount: 600,
    type: "expense",
    category: "Entertainment",
    date: "2026-08-10",
    description: "Movie with friends",
    paymentMethod: "UPI",
    tag: "Discretionary",
  },
  {
    id: 6,
    title: "Bus Pass",
    amount: 900,
    type: "expense",
    category: "Transport",
    date: "2026-08-12",
    description: "Monthly bus pass",
    paymentMethod: "Cash",
    tag: "Essential",
  },
  {
    id: 7,
    title: "Salary",
    amount: 55000,
    type: "income",
    category: "Salary",
    date: "2026-10-01",
    description: "Monthly salary for October",
    paymentMethod: "Net Banking",
    tag: "Essential",
  },
  {
    id: 8,
    title: "Diwali Shopping",
    amount: 6500,
    type: "expense",
    category: "Shopping",
    date: "2026-10-04",
    description: "Festive clothes and home decor",
    paymentMethod: "Credit Card",
    tag: "Discretionary",
  },
  {
    id: 9,
    title: "Supermarket & Groceries",
    amount: 3200,
    type: "expense",
    category: "Food",
    date: "2026-10-08",
    description: "Monthly grocery restock",
    paymentMethod: "UPI",
    tag: "Essential",
  },
  {
    id: 10,
    title: "Wi-Fi & Broadband Bill",
    amount: 1200,
    type: "expense",
    category: "Bills",
    date: "2026-10-12",
    description: "Broadband and phone bill",
    paymentMethod: "UPI",
    tag: "Essential",
  },
  {
    id: 11,
    title: "Consulting Gig",
    amount: 14000,
    type: "income",
    category: "Freelance",
    date: "2026-10-15",
    description: "Tech consulting payment",
    paymentMethod: "Net Banking",
    tag: "Work",
  },
  {
    id: 12,
    title: "Family Restaurant Dinner",
    amount: 1600,
    type: "expense",
    category: "Food",
    date: "2026-10-18",
    description: "Weekend family dinner",
    paymentMethod: "Credit Card",
    tag: "Personal",
  },
  {
    id: 13,
    title: "Fuel & Metro Card",
    amount: 1100,
    type: "expense",
    category: "Transport",
    date: "2026-10-22",
    description: "Monthly commute recharge",
    paymentMethod: "Cash",
    tag: "Essential",
  },
];

// Sample category monthly budgets
export const sampleBudgets = {
  Food: 6000,
  Transport: 2500,
  Bills: 4000,
  Entertainment: 2000,
  Shopping: 3000,
};

// Read all transactions from Local Storage.
// If nothing is saved yet, return the sample transactions instead.
export function getTransactions() {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);

    if (!data) {
      return sampleTransactions;
    }

    const parsed = JSON.parse(data);

    // If the stored data was the original 6 August records, update to the full dataset including October
    if (Array.isArray(parsed) && parsed.length <= 6 && parsed.every((t) => t.id <= 6)) {
      saveTransactions(sampleTransactions);
      return sampleTransactions;
    }

    return parsed;
  } catch (error) {
    console.log("Could not read transactions from Local Storage:", error);
    return [];
  }
}

// Save the given transactions array to Local Storage.
export function saveTransactions(transactions) {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.log("Could not save transactions to Local Storage:", error);
  }
}

// Read the saved theme ("light" or "dark") from Local Storage.
export function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch (error) {
    console.log("Could not read theme from Local Storage:", error);
    return "light";
  }
}

// Save the theme choice to Local Storage.
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.log("Could not save theme to Local Storage:", error);
  }
}

// Read the user's overall savings goal (a rupee amount they're saving
// towards). Defaults to ₹1,00,000 the first time the app is opened.
export function getSavingsGoal() {
  try {
    const data = localStorage.getItem(SAVINGS_GOAL_KEY);
    return data ? Number(data) : 100000;
  } catch (error) {
    console.log("Could not read savings goal from Local Storage:", error);
    return 100000;
  }
}

// Save the user's savings goal amount.
export function saveSavingsGoal(amount) {
  try {
    localStorage.setItem(SAVINGS_GOAL_KEY, String(amount));
  } catch (error) {
    console.log("Could not save savings goal to Local Storage:", error);
  }
}

// Read the user's monthly savings-rate target (a percentage, e.g. 20
// means "try to save 20% of income each month"). Defaults to 20%.
export function getMonthlyTargetRate() {
  try {
    const data = localStorage.getItem(MONTHLY_TARGET_KEY);
    return data ? Number(data) : 20;
  } catch (error) {
    console.log("Could not read monthly target rate from Local Storage:", error);
    return 20;
  }
}

// Save the user's monthly savings-rate target.
export function saveMonthlyTargetRate(rate) {
  try {
    localStorage.setItem(MONTHLY_TARGET_KEY, String(rate));
  } catch (error) {
    console.log("Could not save monthly target rate to Local Storage:", error);
  }
}

// Read the user's monthly category budgets
export function getCategoryBudgets() {
  try {
    const data = localStorage.getItem(CATEGORY_BUDGETS_KEY);
    return data ? JSON.parse(data) : sampleBudgets;
  } catch (error) {
    console.log("Could not read category budgets from Local Storage:", error);
    return sampleBudgets;
  }
}

// Save the user's monthly category budgets
export function saveCategoryBudgets(budgets) {
  try {
    localStorage.setItem(CATEGORY_BUDGETS_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.log("Could not save category budgets to Local Storage:", error);
  }
}

const CATEGORY_SPENT_KEY = "categorySpent";

export const sampleCategorySpent = {
  Food: 2500,
  Transport: 900,
  Bills: 1800,
  Entertainment: 600,
  Shopping: 0,
};

// Read the user's monthly category spent overrides
export function getCategorySpent() {
  try {
    const data = localStorage.getItem(CATEGORY_SPENT_KEY);
    return data ? JSON.parse(data) : sampleCategorySpent;
  } catch (error) {
    console.log("Could not read category spent from Local Storage:", error);
    return sampleCategorySpent;
  }
}

// Save the user's monthly category spent overrides
export function saveCategorySpent(spentMap) {
  try {
    localStorage.setItem(CATEGORY_SPENT_KEY, JSON.stringify(spentMap));
  } catch (error) {
    console.log("Could not save category spent to Local Storage:", error);
  }
}
