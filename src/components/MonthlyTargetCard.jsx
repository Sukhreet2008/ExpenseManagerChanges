import { useState } from "react";
import { formatCurrency, getMonthLabel } from "../utils/helpers.js";

// Lets the user set a monthly savings-rate target (e.g. "save 20% of
// income every month") and shows, month by month, whether they hit it,
// fell short, or actually overspent (expense > income).
//
// "rows" should look like:
//   [{ monthKey, income, expense, savings, rate }, ...]
// where "rate" is a percentage (or null if there was no income that month).

function MonthlyTargetCard({ rows, targetRate, onUpdateTarget }) {
  const [editing, setEditing] = useState(false);
  const [draftTarget, setDraftTarget] = useState(targetRate);

  function startEditing() {
    setDraftTarget(targetRate);
    setEditing(true);
  }

  function handleSave(event) {
    event.preventDefault();
    const rate = Number(draftTarget);
    if (!isNaN(rate) && rate >= 0 && rate <= 100) {
      onUpdateTarget(rate);
    }
    setEditing(false);
  }

  function statusFor(row) {
    if (row.rate === null) {
      return { label: "No income", className: "badge-neutral" };
    }
    if (row.expense > row.income) {
      return { label: "Overspending", className: "badge-danger" };
    }
    if (row.rate >= targetRate) {
      return { label: "On track", className: "badge-success" };
    }
    return { label: "Below target", className: "badge-warning" };
  }

  return (
    <div className="card">
      <div className="card-header-row">
        <h2>Monthly Savings Target</h2>
        {!editing && (
          <button className="btn btn-secondary btn-small" onClick={startEditing}>
            Edit Target
          </button>
        )}
      </div>

      {editing ? (
        <form className="inline-edit-form" onSubmit={handleSave}>
          <label>
            Target savings rate (% of income)
            <input
              type="number"
              min="0"
              max="100"
              value={draftTarget}
              onChange={(e) => setDraftTarget(e.target.value)}
              autoFocus
            />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Target
            </button>
          </div>
        </form>
      ) : (
        <p className="analytics-note">
          Target: save at least <strong>{targetRate}%</strong> of income every month.
        </p>
      )}

      {rows.length === 0 ? (
        <p className="chart-empty">Not enough data yet.</p>
      ) : (
        <table className="trend-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expense</th>
              <th>Saved</th>
              <th>Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = statusFor(row);
              return (
                <tr key={row.monthKey}>
                  <td>{getMonthLabel(row.monthKey)}</td>
                  <td className="text-income">{formatCurrency(row.income)}</td>
                  <td className="text-expense">{formatCurrency(row.expense)}</td>
                  <td>{formatCurrency(row.savings)}</td>
                  <td>{row.rate === null ? "—" : row.rate + "%"}</td>
                  <td>
                    <span className={"badge " + status.className}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MonthlyTargetCard;
