// Small helper functions and constants shared across the app.

export const incomeCategories = ["Salary", "Freelance", "Business", "Investment", "Bonus", "Other"];

export const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
];

export const allCategories = [...incomeCategories, ...expenseCategories].filter(
  (category, index, array) => array.indexOf(category) === index // remove duplicates like "Other"
);

export const paymentMethods = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
];

export const transactionTags = [
  "Essential",
  "Discretionary",
  "Work",
  "Personal",
  "Recurring",
  "Savings",
];

// Turn a number into a nicely formatted Rupee amount, e.g. 45000 -> "₹45,000"
export function formatCurrency(amount) {
  const number = Number(amount) || 0;
  return "₹" + number.toLocaleString("en-IN");
}

// Turn "2026-08-15" into "15 Aug 2026"
export function formatDate(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Get a "YYYY-MM" key from a date string, used for grouping by month.
export function getMonthKey(dateString) {
  if (!dateString) return "";
  return dateString.slice(0, 7);
}

// Turn "2026-08" into "Aug 2026"
export function getMonthLabel(monthKey) {
  if (!monthKey) return "";
  const date = new Date(monthKey + "-01");
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

// Work out what % of income was saved: (income - expense) / income * 100.
// Returns null when there was no income at all, since a rate doesn't
// really mean anything in that case.
export function getSavingsRate(income, expense) {
  if (!income) return null;
  return Math.round(((income - expense) / income) * 100);
}

// Get the Monday-based week number's start date for a given date string,
// used for grouping transactions by week.
export function getWeekStart(dateString) {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday
  const diff = (day === 0 ? -6 : 1) - day; // move back to Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}
