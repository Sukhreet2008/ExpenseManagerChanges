import StatCard from "../components/StatCard.jsx";
import RecentTransactions from "../components/RecentTransactions.jsx";
import ChartCard from "../components/ChartCard.jsx";
import QuickStats from "../components/QuickStats.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatCurrency, getMonthLabel, getMonthKey, getSavingsRate } from "../utils/helpers.js";

// The Dashboard page is only responsible for CALCULATING the numbers
// from "transactions" (using filter/reduce/map/sort). Once the numbers
// are ready, it hands them off to small display components:
//   StatCard, RecentTransactions, ChartCard, QuickStats.
// This keeps the "logic" and the "display" separate, so each piece can
// be opened and edited on its own.

function Dashboard({ transactions, onEdit, onDelete, onAddClick }) {
  // --- Totals ---------------------------------------------------------

  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const totalIncome = incomeTransactions.reduce((total, t) => total + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((total, t) => total + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // --- Recent transactions (last 5, newest first) ----------------------

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // --- Category spending summary (expenses only, top 5) ------------------

  const categoryTotals = {};
  expenseTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const categoryData = Object.keys(categoryTotals)
    .map((category) => ({ label: category, value: categoryTotals[category] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // --- Monthly summary (last 4 months, expenses) --------------------------

  const monthTotals = {};
  transactions.forEach((t) => {
    const key = getMonthKey(t.date);
    if (!monthTotals[key]) {
      monthTotals[key] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      monthTotals[key].income += t.amount;
    } else {
      monthTotals[key].expense += t.amount;
    }
  });

  const monthKeys = Object.keys(monthTotals).sort().slice(-4);
  const monthlyExpenseData = monthKeys.map((key) => ({
    label: getMonthLabel(key),
    value: monthTotals[key].expense,
  }));

  // --- Quick statistics ---------------------------------------------------

  const averageExpense =
    expenseTransactions.length > 0 ? totalExpense / expenseTransactions.length : 0;
  const biggestExpense = expenseTransactions.reduce(
    (max, t) => (t.amount > max ? t.amount : max),
    0
  );
  const savingsRate = getSavingsRate(totalIncome, totalExpense);

  const quickStats = [
    { label: "Total Transactions", value: transactions.length },
    { label: "Average Expense", value: formatCurrency(averageExpense) },
    { label: "Biggest Expense", value: formatCurrency(biggestExpense) },
    { label: "Savings Rate", value: (savingsRate === null ? 0 : savingsRate) + "%" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <button className="btn btn-primary" onClick={onAddClick}>
          + Add Transaction
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Balance"
          value={formatCurrency(balance)}
          icon="💰"
          type="balance"
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          icon="📈"
          type="income"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpense)}
          icon="📉"
          type="expense"
        />
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          message="Add your first income or expense to get started."
          buttonLabel="Add Transaction"
          onButtonClick={onAddClick}
        />
      ) : (
        <>
          <div className="dashboard-grid">
            <RecentTransactions
              transactions={recentTransactions}
              onEdit={onEdit}
              onDelete={onDelete}
            />

            <ChartCard
              title="Top Spending Categories"
              data={categoryData}
              direction="horizontal"
              color="var(--expense)"
            />
          </div>

          <ChartCard
            title="Monthly Summary"
            data={monthlyExpenseData}
            direction="vertical"
            color="var(--accent)"
          />

          <QuickStats stats={quickStats} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
