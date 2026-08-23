import { useState } from "react";
import { formatCurrency } from "../utils/helpers.js";

// Lets the user set an overall savings goal (a rupee amount) and shows
// how close their lifetime savings (total income - total expense) is
// to reaching it, as a progress bar.

function SavingsGoalCard({ totalSaved, goal, onUpdateGoal }) {
  const [editing, setEditing] = useState(false);
  const [draftGoal, setDraftGoal] = useState(goal);

  const progressPercent = goal > 0 ? Math.min(100, Math.max(0, (totalSaved / goal) * 100)) : 0;
  const reached = totalSaved >= goal && goal > 0;
  const remaining = Math.max(0, goal - totalSaved);

  function startEditing() {
    setDraftGoal(goal);
    setEditing(true);
  }

  function handleSave(event) {
    event.preventDefault();
    const amount = Number(draftGoal);
    if (!isNaN(amount) && amount > 0) {
      onUpdateGoal(amount);
    }
    setEditing(false);
  }

  return (
    <div className="card">
      <div className="card-header-row">
        <h2>Savings Goal</h2>
        {!editing && (
          <button className="btn btn-secondary btn-small" onClick={startEditing}>
            Edit Goal
          </button>
        )}
      </div>

      {editing ? (
        <form className="inline-edit-form" onSubmit={handleSave}>
          <label>
            Goal amount (₹)
            <input
              type="number"
              min="1"
              value={draftGoal}
              onChange={(e) => setDraftGoal(e.target.value)}
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
              Save Goal
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="savings-goal-numbers">
            <span className="savings-goal-current">{formatCurrency(totalSaved)}</span>
            <span className="savings-goal-target">of {formatCurrency(goal)}</span>
          </div>

          <div className="progress-track">
            <div
              className={"progress-fill" + (reached ? " progress-fill-reached" : "")}
              style={{ width: progressPercent + "%" }}
            ></div>
          </div>

          <p className="analytics-note">
            {reached
              ? "🎉 Goal reached! Consider setting a new target."
              : `${progressPercent.toFixed(0)}% there — ${formatCurrency(remaining)} to go.`}
          </p>
        </>
      )}
    </div>
  );
}

export default SavingsGoalCard;
