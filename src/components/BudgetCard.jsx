import { useState } from "react";
import { formatCurrency } from "../utils/helpers.js";

// BudgetCard: Displays a single category budget with limit, spent amount,
// progress indicator, remaining safe-to-spend calculation, and inline editing for spent amount.
function BudgetCard({ category, limit, spent, onEdit, onUpdateSpent, onDelete }) {
  const [editingSpent, setEditingSpent] = useState(false);
  const [draftSpent, setDraftSpent] = useState(spent);

  const percent = limit > 0 ? Math.min(200, (spent / limit) * 100) : 0;
  const isOver = spent > limit;
  const isNear = percent >= 80 && !isOver;
  const remainingSafe = Math.max(0, limit - spent);
  const overspentAmount = Math.max(0, spent - limit);

  // Status color badge
  let statusBadge = { label: "Within Budget", className: "badge-success" };
  if (isOver) {
    statusBadge = { label: "Over Budget", className: "badge-danger" };
  } else if (isNear) {
    statusBadge = { label: "Near Limit (>80%)", className: "badge-warning" };
  }

  function handleSaveSpent(e) {
    e.preventDefault();
    const amount = Number(draftSpent);
    if (!isNaN(amount) && amount >= 0) {
      if (onUpdateSpent) {
        onUpdateSpent(category, amount);
      }
      setEditingSpent(false);
    }
  }

  return (
    <div className={`card budget-card ${isOver ? "budget-card-over" : ""}`}>
      <div className="card-header-row">
        <div>
          <h3>{category}</h3>
          <span className={`badge ${statusBadge.className}`}>{statusBadge.label}</span>
        </div>
        <div className="card-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(category, limit, spent)}
            title="Edit Budget Limit & Details"
          >
            ✏️
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onDelete(category)}
            title="Remove Category Budget"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="budget-numbers">
        <div>
          <span className="budget-label">Spent This Month</span>
          {editingSpent ? (
            <form className="inline-spent-form" onSubmit={handleSaveSpent}>
              <input
                type="number"
                min="0"
                step="any"
                value={draftSpent}
                onChange={(e) => setDraftSpent(e.target.value)}
                autoFocus
                className="spent-input"
                placeholder="0"
              />
              <button type="submit" className="btn btn-primary btn-mini" title="Save spent">
                ✓
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-mini"
                onClick={() => {
                  setDraftSpent(spent);
                  setEditingSpent(false);
                }}
                title="Cancel"
              >
                ✕
              </button>
            </form>
          ) : (
            <div className="spent-display-row">
              <p className={`budget-amount ${isOver ? "text-expense" : "text-income"}`}>
                {formatCurrency(spent)}
              </p>
              <button
                type="button"
                className="icon-btn-small"
                onClick={() => {
                  setDraftSpent(spent);
                  setEditingSpent(true);
                }}
                title="Edit spent amount directly"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        <div className="text-right">
          <span className="budget-label">Monthly Limit</span>
          <p className="budget-amount">{formatCurrency(limit)}</p>
        </div>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${
            isOver
              ? "progress-fill-danger"
              : isNear
              ? "progress-fill-warning"
              : "progress-fill-accent"
          }`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      <div className="budget-footer">
        <span className="analytics-note">
          {percent.toFixed(0)}% used
        </span>
        <span className="analytics-note">
          {isOver
            ? `Exceeded by ${formatCurrency(overspentAmount)}`
            : `${formatCurrency(remainingSafe)} safe to spend`}
        </span>
      </div>
    </div>
  );
}

export default BudgetCard;
