import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import StatCard from "../components/StatCard.jsx";
import RecentTransactions from "../components/RecentTransactions.jsx";
import ChartCard from "../components/ChartCard.jsx";
import QuickStats from "../components/QuickStats.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatCurrency, getMonthLabel, getMonthKey, getSavingsRate } from "../utils/helpers.js";
import { selectAllTransactions, deleteTransaction } from "../store/transactionsSlice.js";
import { useModal } from "../context/ModalContext.js";
import { useToast } from "../context/ToastContext.js";

// Dashboard: High-level financial overview with month-by-month filtering and charts.
function Dashboard(props) {
  const reduxTransactions = useSelector(selectAllTransactions);
  const transactions = props.transactions || reduxTransactions;

  const dispatch = useDispatch();
  const { openAddTransaction, openEditTransaction } = useModal();
  const { showToast } = useToast();

  const handleAddClick = props.onAddClick || openAddTransaction;
  const handleEdit = props.onEdit || openEditTransaction;
  const handleDelete =
    props.onDelete ||
    ((id) => {
      dispatch(deleteTransaction(id));
      showToast("Transaction deleted", "info");
    });

  // Extract all unique months from transactions in reverse chronological order
  const availableMonths = [
    ...new Set(transactions.map((t) => getMonthKey(t.date)).filter(Boolean)),
  ].sort().reverse();

  // Default to latest month if available, otherwise "all"
  const [selectedMonth, setSelectedMonth] = useState(() =>
    availableMonths.length > 0 ? availableMonths[0] : "all"
  );

  // Filter transactions according to selected month
  const displayedTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter((t) => getMonthKey(t.date) === selectedMonth);

  // --- Monthly Totals for Displayed Selection -----------------------------
  const incomeTransactions = displayedTransactions.filter((t) => t.type === "income");
  const expenseTransactions = displayedTransactions.filter((t) => t.type === "expense");

  const totalIncome = incomeTransactions.reduce((total, t) => total + Number(t.amount || 0), 0);
  const totalExpense = expenseTransactions.reduce((total, t) => total + Number(t.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  // --- Recent transactions for selected month ----------------------------
  const recentTransactions = [...displayedTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // --- Category spending summary for selected month (top 5) ---------------
  const categoryTotals = {};
  expenseTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount || 0);
  });

  const categoryData = Object.keys(categoryTotals)
    .map((category) => ({ label: category, value: categoryTotals[category] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // --- Month-wise comparison data (All active months) ---------------------
  const monthTotals = {};
  transactions.forEach((t) => {
    const key = getMonthKey(t.date);
    if (!key) return;
    if (!monthTotals[key]) {
      monthTotals[key] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      monthTotals[key].income += Number(t.amount || 0);
    } else {
      monthTotals[key].expense += Number(t.amount || 0);
    }
  });

  const allMonthKeys = Object.keys(monthTotals).sort();
  const monthlyComparisonData = allMonthKeys.map((key) => ({
    label: getMonthLabel(key),
    value: monthTotals[key].expense,
  }));

  // Cash flow chart data for the selected month
  const cashFlowData = [
    { label: "Income", value: totalIncome },
    { label: "Expense", value: totalExpense },
  ];

  // --- Quick statistics for selected month --------------------------------
  const averageExpense =
    expenseTransactions.length > 0 ? totalExpense / expenseTransactions.length : 0;
  const biggestExpense = expenseTransactions.reduce(
    (max, t) => (Number(t.amount) > max ? Number(t.amount) : max),
    0
  );
  const savingsRate = getSavingsRate(totalIncome, totalExpense);

  const monthLabelText =
    selectedMonth === "all" ? "All Time" : getMonthLabel(selectedMonth);

  const quickStats = [
    { label: `${monthLabelText} Transactions`, value: displayedTransactions.length },
    { label: "Average Expense", value: formatCurrency(averageExpense) },
    { label: "Biggest Expense", value: formatCurrency(biggestExpense) },
    { label: "Savings Rate", value: (savingsRate === null ? 0 : savingsRate) + "%" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Month-wise overview of income, expenses, and cash flows.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleAddClick}>
          + Add Transaction
        </button>
      </div>

      {/* Month Selector Bar */}
      {availableMonths.length > 0 && (
        <div className="dashboard-month-filter">
          <span className="month-filter-label">Select Month:</span>
          <div className="month-pill-group">
            <button
              type="button"
              className={`month-pill ${selectedMonth === "all" ? "active" : ""}`}
              onClick={() => setSelectedMonth("all")}
            >
              All Time
            </button>
            {availableMonths.map((m) => (
              <button
                key={m}
                type="button"
                className={`month-pill ${selectedMonth === m ? "active" : ""}`}
                onClick={() => setSelectedMonth(m)}
              >
                {getMonthLabel(m)}
              </button>
            ))}
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-select-dropdown"
            aria-label="Filter transactions by month"
          >
            <option value="all">All Time (Total)</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {getMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Month Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label={`${monthLabelText} Balance`}
          value={formatCurrency(balance)}
          icon="💰"
          type="balance"
        />
        <StatCard
          label={`${monthLabelText} Income`}
          value={formatCurrency(totalIncome)}
          icon="📈"
          type="income"
        />
        <StatCard
          label={`${monthLabelText} Expenses`}
          value={formatCurrency(totalExpense)}
          icon="📉"
          type="expense"
        />
      </div>

      {displayedTransactions.length === 0 ? (
        <EmptyState
          title={`No transactions in ${monthLabelText}`}
          message="Add your first income or expense for this month to see insights."
          buttonLabel="Add Transaction"
          onButtonClick={handleAddClick}
        />
      ) : (
        <>
          <div className="dashboard-grid">
            <RecentTransactions
              transactions={recentTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <ChartCard
              title={`Top Categories (${monthLabelText})`}
              data={categoryData}
              direction="horizontal"
              color="var(--expense)"
            />
          </div>

          <div className="dashboard-grid">
            <ChartCard
              title={`Cash Flow (${monthLabelText})`}
              data={cashFlowData}
              direction="horizontal"
              color="var(--income)"
            />

            <ChartCard
              title="Month-wise Expense Comparison"
              data={monthlyComparisonData}
              direction="vertical"
              color="var(--accent)"
            />
          </div>

          <QuickStats stats={quickStats} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
