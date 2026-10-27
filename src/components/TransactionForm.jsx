import { useForm } from "../hooks/useForm.js";
import TypeSwitch from "./TypeSwitch.jsx";
import {
  incomeCategories,
  expenseCategories,
  paymentMethods,
  transactionTags,
} from "../utils/helpers.js";

// TransactionForm: Handles both Add and Edit modes.
// Demonstrates advanced React form handling:
//   - Custom useForm hook with controlled inputs
//   - Real-time field validation with visual error states
//   - Touch tracking (errors display only once touched or on submit)
//   - Multiple input types: text, number, date, select, textarea, and custom toggle
//   - Character limit tracking and dirty-state reset

function validateTransaction(values) {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters.";
  }

  const amountNum = Number(values.amount);
  if (!values.amount || isNaN(amountNum) || amountNum <= 0) {
    errors.amount = "Amount must be greater than 0.";
  } else if (amountNum > 10000000) {
    errors.amount = "Amount cannot exceed ₹1,00,00,000.";
  }

  if (!values.category) {
    errors.category = "Please select a category.";
  }

  if (!values.date) {
    errors.date = "Please select a date.";
  }

  if (values.description && values.description.length > 150) {
    errors.description = "Description cannot exceed 150 characters.";
  }

  return errors;
}

function TransactionForm({ editingTransaction, onSave, onCancel }) {
  const initialValues = {
    title: editingTransaction?.title || "",
    amount: editingTransaction?.amount !== undefined ? editingTransaction.amount : "",
    type: editingTransaction?.type || "expense",
    category:
      editingTransaction?.category ||
      (editingTransaction?.type === "income" ? incomeCategories[0] : expenseCategories[0]),
    date: editingTransaction?.date || new Date().toISOString().slice(0, 10),
    paymentMethod: editingTransaction?.paymentMethod || "UPI",
    tag: editingTransaction?.tag || "Essential",
    description: editingTransaction?.description || "",
  };

  const {
    values,
    errors,
    touched,
    isDirty,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit,
  } = useForm({
    initialValues,
    validate: validateTransaction,
    onSubmit: (formValues) => {
      onSave({
        ...formValues,
        amount: Number(formValues.amount),
        title: formValues.title.trim(),
        description: formValues.description.trim(),
      });
    },
  });

  function handleTypeChange(newType) {
    const categories = newType === "income" ? incomeCategories : expenseCategories;
    setFieldValue("type", newType);
    setFieldValue("category", categories[0]);
  }

  const availableCategories =
    values.type === "income" ? incomeCategories : expenseCategories;

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
        {isDirty && <span className="unsaved-badge">Unsaved changes</span>}
      </div>

      <TypeSwitch value={values.type} onChange={handleTypeChange} />

      <div className="form-grid">
        <label>
          Title *
          <input
            type="text"
            className={touched.title && errors.title ? "input-error" : ""}
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            placeholder="e.g. Groceries, Freelance project"
          />
          {touched.title && errors.title && (
            <span className="form-field-error">{errors.title}</span>
          )}
        </label>

        <label>
          Amount (₹) *
          <input
            type="number"
            min="0.01"
            step="any"
            className={touched.amount && errors.amount ? "input-error" : ""}
            value={values.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            onBlur={() => handleBlur("amount")}
            placeholder="0.00"
          />
          {touched.amount && errors.amount && (
            <span className="form-field-error">{errors.amount}</span>
          )}
        </label>

        <label>
          Category *
          <select
            className={touched.category && errors.category ? "input-error" : ""}
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            onBlur={() => handleBlur("category")}
          >
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <span className="form-field-error">{errors.category}</span>
          )}
        </label>

        <label>
          Date *
          <input
            type="date"
            className={touched.date && errors.date ? "input-error" : ""}
            value={values.date}
            onChange={(e) => handleChange("date", e.target.value)}
            onBlur={() => handleBlur("date")}
          />
          {touched.date && errors.date && (
            <span className="form-field-error">{errors.date}</span>
          )}
        </label>

        <label>
          Payment Method
          <select
            value={values.paymentMethod}
            onChange={(e) => handleChange("paymentMethod", e.target.value)}
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tag
          <select
            value={values.tag}
            onChange={(e) => handleChange("tag", e.target.value)}
          >
            {transactionTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label className="full-width">
          <div className="label-with-meta">
            <span>Description (optional)</span>
            <span className="char-count">
              {values.description ? values.description.length : 0} / 150
            </span>
          </div>
          <textarea
            className={touched.description && errors.description ? "input-error" : ""}
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Add notes, store name, or receipt details..."
            rows={2}
          />
          {touched.description && errors.description && (
            <span className="form-field-error">{errors.description}</span>
          )}
        </label>
      </div>

      <div className="form-actions">
        {isDirty && (
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => resetForm()}
          >
            Reset Form
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid && Object.keys(touched).length > 0}
        >
          {editingTransaction ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
