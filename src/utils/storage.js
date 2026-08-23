// This file contains simple helper functions for saving and loading
// data from the browser's Local Storage. Local Storage lets a website
// remember data even after the page is refreshed or closed.

const TRANSACTIONS_KEY = "transactions";
const THEME_KEY = "theme";
const SAVINGS_GOAL_KEY = "savingsGoal";
const MONTHLY_TARGET_KEY = "monthlyTargetRate";

// A few sample transactions so the app is not completely empty
// the very first time someone opens it.
const sampleTransactions = [
  {
    id: 1,
    title: "Salary",
    amount: 50000,
    type: "income",
    category: "Salary",
    date: "2026-08-01",
    description: "Monthly salary",
  },
  {
    id: 2,
    title: "Groceries",
    amount: 2500,
    type: "expense",
    category: "Food",
    date: "2026-08-03",
    description: "Monthly groceries",
  },
  {
    id: 3,
    title: "Electricity Bill",
    amount: 1800,
    type: "expense",
    category: "Bills",
    date: "2026-08-05",
    description: "Electricity bill for August",
  },
  {
    id: 4,
    title: "Freelance Project",
    amount: 8000,
    type: "income",
    category: "Freelance",
    date: "2026-08-08",
    description: "Website project payment",
  },
  {
    id: 5,
    title: "Movie Night",
    amount: 600,
    type: "expense",
    category: "Entertainment",
    date: "2026-08-10",
    description: "Movie with friends",
  },
  {
    id: 6,
    title: "Bus Pass",
    amount: 900,
    type: "expense",
    category: "Transport",
    date: "2026-08-12",
    description: "Monthly bus pass",
  },
];

// Read all transactions from Local Storage.
// If nothing is saved yet, return the sample transactions instead.
export function getTransactions() {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);

    if (!data) {
      return sampleTransactions;
    }

    return JSON.parse(data);
  } catch (error) {
    // If something goes wrong while reading/parsing Local Storage,
    // just log it and return an empty list instead of crashing the app.
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
