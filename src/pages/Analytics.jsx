import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChartCard from "../components/ChartCard.jsx";
import IncomeVsExpenseCard from "../components/IncomeVsExpenseCard.jsx";
import MonthlyTrendTable from "../components/MonthlyTrendTable.jsx";
import SavingsGoalCard from "../components/SavingsGoalCard.jsx";
import MonthlyTargetCard from "../components/MonthlyTargetCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getMonthKey, getMonthLabel, getWeekStart, getSavingsRate } from "../utils/helpers.js";
import { selectAllTransactions } from "../store/transactionsSlice.js";
import {
  selectSavingsGoal,
  selectMonthlyTargetRate,
  updateSavingsGoal,
  updateMonthlyTargetRate,
} from "../store/budgetSlice.js";
import { useToast } from "../context/ToastContext.js";

function Analytics(props) {
  const [activeTab, setActiveTab] = useState("overview");

  const reduxTransactions = useSelector(selectAllTransactions);
  const reduxSavingsGoal = useSelector(selectSavingsGoal);
  const reduxMonthlyTarget = useSelector(selectMonthlyTargetRate);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const transactions = props.transactions || reduxTransactions;
  const savingsGoal = props.savingsGoal !== undefined ? props.savingsGoal : reduxSavingsGoal;
  const monthlyTargetRate =
    props.monthlyTargetRate !== undefined ? props.monthlyTargetRate : reduxMonthlyTarget;

  function handleUpdateGoal(amount) {
    if (props.onUpdateSavingsGoal) {
      props.onUpdateSavingsGoal(amount);
    } else {
      dispatch(updateSavingsGoal(amount));
    }
    showToast("Savings goal updated!", "success");
  }

  function handleUpdateTarget(rate) {
    if (props.onUpdateMonthlyTarget) {
      props.onUpdateMonthlyTarget(rate);
    } else {
      dispatch(updateMonthlyTargetRate(rate));
    }
    showToast("Monthly target rate updated!", "success");
  }

  if (transactions.length === 0) {
    return (
      <div className="page">
        <h1>Analytics</h1>
        <EmptyState
          title="Nothing to analyze yet"
          message="Add a few transactions and this page will fill up with charts."
        />
      </div>
    );
  }

  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const incomeTransactions = transactions.filter((t) => t.type === "income");

  // 1. Expense by Category
  const categoryTotals = {};
  expenseTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount || 0);
  });
  const categoryData = Object.keys(categoryTotals)
    .map((category) => ({ label: category, value: categoryTotals[category] }))
    .sort((a, b) => b.value - a.value);

  // 2. Monthly Expense
  const monthlyExpenseTotals = {};
  expenseTransactions.forEach((t) => {
    const key = getMonthKey(t.date);
    monthlyExpenseTotals[key] = (monthlyExpenseTotals[key] || 0) + Number(t.amount || 0);
  });
  const monthlyExpenseData = Object.keys(monthlyExpenseTotals)
    .sort()
    .map((key) => ({ label: getMonthLabel(key), value: monthlyExpenseTotals[key] }));

  // 3. Income vs Expense totals
  const totalIncome = incomeTransactions.reduce((total, t) => total + Number(t.amount || 0), 0);
  const totalExpense = expenseTransactions.reduce((total, t) => total + Number(t.amount || 0), 0);

  // 4. Weekly Spending (last 6 weeks)
  const weeklyTotals = {};
  expenseTransactions.forEach((t) => {
    const weekKey = getWeekStart(t.date);
    weeklyTotals[weekKey] = (weeklyTotals[weekKey] || 0) + Number(t.amount || 0);
  });
  const weeklyData = Object.keys(weeklyTotals)
    .sort()
    .slice(-6)
    .map((weekKey) => {
      const date = new Date(weekKey);
      const label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      return { label, value: weeklyTotals[weekKey] };
    });

  // 5. Monthly Trend (income and expense together, last 6 months)
  const monthlyIncomeTotals = {};
  incomeTransactions.forEach((t) => {
    const key = getMonthKey(t.date);
    monthlyIncomeTotals[key] = (monthlyIncomeTotals[key] || 0) + Number(t.amount || 0);
  });

  const trendRows = [
    ...new Set([...Object.keys(monthlyExpenseTotals), ...Object.keys(monthlyIncomeTotals)]),
  ]
    .sort()
    .slice(-6)
    .map((monthKey) => ({
      monthKey,
      income: monthlyIncomeTotals[monthKey] || 0,
      expense: monthlyExpenseTotals[monthKey] || 0,
    }));

  // 6. Savings: goal progress + monthly target tracking (last 12 months)
  const savingsTrendRows = [
    ...new Set([...Object.keys(monthlyExpenseTotals), ...Object.keys(monthlyIncomeTotals)]),
  ]
    .sort()
    .slice(-12)
    .map((monthKey) => {
      const income = monthlyIncomeTotals[monthKey] || 0;
      const expense = monthlyExpenseTotals[monthKey] || 0;
      return {
        monthKey,
        income,
        expense,
        savings: income - expense,
        rate: getSavingsRate(income, expense),
      };
    });

  const totalSaved = totalIncome - totalExpense;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-subtitle">Deep dive into your cash flows, category habits, and savings.</p>
        </div>
      </div>

      <div className="type-switch analytics-tabs">
        <button
          type="button"
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          type="button"
          className={activeTab === "savings" ? "active" : ""}
          onClick={() => setActiveTab("savings")}
        >
          Savings
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          <IncomeVsExpenseCard totalIncome={totalIncome} totalExpense={totalExpense} />

          <div className="analytics-grid">
            <ChartCard
              title="Expense by Category"
              data={categoryData}
              direction="horizontal"
              color="var(--expense)"
            />

            <ChartCard
              title="Monthly Expense"
              data={monthlyExpenseData}
              direction="vertical"
              color="var(--accent)"
            />
          </div>

          <ChartCard
            title="Weekly Spending (last 6 weeks)"
            data={weeklyData}
            direction="vertical"
            color="var(--expense)"
          />

          <MonthlyTrendTable rows={trendRows} />
        </>
      ) : (
        <>
          <SavingsGoalCard
            totalSaved={totalSaved}
            goal={savingsGoal}
            onUpdateGoal={handleUpdateGoal}
          />

          <MonthlyTargetCard
            rows={savingsTrendRows}
            targetRate={monthlyTargetRate}
            onUpdateTarget={handleUpdateTarget}
          />
        </>
      )}
    </div>
  );
}

export default Analytics;
