import { useState } from "react";
import TypeSwitch from "./TypeSwitch.jsx";
import { incomeCategories, expenseCategories } from "../utils/helpers.js";

// This form is used for BOTH adding a new transaction and editing an
// existing one. If "editingTransaction" is passed in, the form starts
// out filled with that transaction's data. Otherwise it starts empty.

function getEmptyForm() {
  return {
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  };
}

function TransactionForm({ editingTransaction, onSave, onCancel }) {
  const [form, setForm] = useState(
    editingTransaction
      ? {
          title: editingTransaction.title,
          amount: editingTransaction.amount,
          type: editingTransaction.type,
          category: editingTransaction.category,
          date: editingTransaction.date,
          description: editingTransaction.description || "",
        }
      : getEmptyForm()
  );
  const [error, setError] = useState("");

  // Update a single field in the form state.
  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  // When the transaction type changes, reset the category to a sensible
  // default for that type (income categories vs expense categories).
  function handleTypeChange(newType) {
    const categories = newType === "income" ? incomeCategories : expenseCategories;
    setForm({ ...form, type: newType, category: categories[0] });
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Basic validation using plain JavaScript, no external library.
    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!form.category) {
      setError("Please choose a category.");
      return;
    }

    if (!form.date) {
      setError("Please choose a date.");
      return;
    }

    setError("");

    onSave({
      ...form,
      amount: Number(form.amount),
    });
  }

  const categories = form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>

      <TypeSwitch value={form.type} onChange={handleTypeChange} />

      <div className="form-grid">
        <label>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. Groceries"
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="0.00"
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </label>

        <label className="full-width">
          Description (optional)
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Add a short note..."
            rows={2}
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {editingTransaction ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
