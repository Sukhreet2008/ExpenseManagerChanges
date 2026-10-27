import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCategoryBudgets,
  selectCategorySpent,
  setCategoryBudget,
  updateCategorySpent,
  deleteCategoryBudget,
} from "../store/budgetSlice.js";
import { selectAllTransactions } from "../store/transactionsSlice.js";
import { useToast } from "../context/ToastContext.js";
import BudgetCard from "../components/BudgetCard.jsx";
import BudgetForm from "../components/BudgetForm.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatCurrency, getMonthKey } from "../utils/helpers.js";

// Budgets: Monthly Category Budget Planner Page
// Demonstrates Redux Toolkit state consumption + Context toast + Form validation
function Budgets() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const categoryBudgets = useSelector(selectCategoryBudgets);
  const categorySpent = useSelector(selectCategorySpent);
  const transactions = useSelector(selectAllTransactions);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Compute expenses for current active month from transactions as fallback
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = transactions.filter(
    (t) => t.type === "expense" && getMonthKey(t.date) === currentMonthKey
  );

  const spentFromTransactions = {};
  currentMonthExpenses.forEach((t) => {
    spentFromTransactions[t.category] =
      (spentFromTransactions[t.category] || 0) + Number(t.amount);
  });

  const categories = Object.keys(categoryBudgets);

  // Helper to get effective spent amount for a category
  function getEffectiveSpent(cat) {
    if (categorySpent && categorySpent[cat] !== undefined) {
      return Number(categorySpent[cat]);
    }
    return Number(spentFromTransactions[cat] || 0);
  }

  const totalBudgeted = categories.reduce(
    (sum, cat) => sum + Number(categoryBudgets[cat] || 0),
    0
  );
  const totalSpentInBudgeted = categories.reduce(
    (sum, cat) => sum + getEffectiveSpent(cat),
    0
  );
  const safeToSpend = Math.max(0, totalBudgeted - totalSpentInBudgeted);

  function handleSaveBudget({ category, amount, spent }) {
    dispatch(setCategoryBudget({ category, amount, spent }));
    showToast(
      `Budget for ${category} set to ${formatCurrency(amount)} (Spent: ${formatCurrency(
        spent || 0
      )})`,
      "success"
    );
    setShowAddForm(false);
    setEditingCategory(null);
  }

  function handleUpdateSpent(category, amount) {
    dispatch(updateCategorySpent({ category, amount }));
    showToast(
      `Updated spent for ${category} to ${formatCurrency(amount)}`,
      "success"
    );
  }

  function handleEdit(category, limit, spent) {
    setEditingCategory({ category, limit, spent });
    setShowAddForm(true);
  }

  function handleDelete(category) {
    if (window.confirm(`Are you sure you want to remove the budget for ${category}?`)) {
      dispatch(deleteCategoryBudget(category));
      showToast(`Removed budget for ${category}`, "info");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Category Budgets</h1>
          <p className="page-subtitle">
            Plan monthly spending caps and monitor safe-to-spend allowances.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? "Close Form" : "+ Set Category Budget"}
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Monthly Budget"
          value={formatCurrency(totalBudgeted)}
          icon="🎯"
          type="balance"
        />
        <StatCard
          label="Spent This Month"
          value={formatCurrency(totalSpentInBudgeted)}
          icon="💳"
          type="expense"
        />
        <StatCard
          label="Safe To Spend"
          value={formatCurrency(safeToSpend)}
          icon="🛡️"
          type="income"
        />
      </div>

      {showAddForm && (
        <div className="card budget-form-card">
          <h2>
            {editingCategory
              ? `Edit Budget: ${editingCategory.category}`
              : "Set Category Budget Limit"}
          </h2>
          <BudgetForm
            initialCategory={editingCategory?.category}
            initialAmount={editingCategory?.limit}
            initialSpent={editingCategory?.spent}
            onSave={handleSaveBudget}
            onCancel={() => {
              setShowAddForm(false);
              setEditingCategory(null);
            }}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState
          title="No Category Budgets Configured"
          message="Set spending targets for categories like Food, Bills, and Shopping to track overspending."
          buttonLabel="Set First Budget"
          onButtonClick={() => setShowAddForm(true)}
        />
      ) : (
        <div className="budget-grid">
          {categories.map((cat) => (
            <BudgetCard
              key={cat}
              category={cat}
              limit={categoryBudgets[cat]}
              spent={getEffectiveSpent(cat)}
              onEdit={handleEdit}
              onUpdateSpent={handleUpdateSpent}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Budgets;
