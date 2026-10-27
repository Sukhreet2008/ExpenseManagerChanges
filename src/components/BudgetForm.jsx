import { useForm } from "../hooks/useForm.js";
import { expenseCategories } from "../utils/helpers.js";

function validateBudget(values) {
  const errors = {};
  if (!values.category) {
    errors.category = "Please select a category.";
  }
  const amount = Number(values.amount);
  if (!values.amount || isNaN(amount) || amount <= 0) {
    errors.amount = "Budget limit must be greater than 0.";
  } else if (amount > 1000000) {
    errors.amount = "Budget limit cannot exceed ₹10,00,000.";
  }

  if (values.spent !== undefined && values.spent !== "") {
    const spentNum = Number(values.spent);
    if (isNaN(spentNum) || spentNum < 0) {
      errors.spent = "Spent amount cannot be negative.";
    }
  }

  return errors;
}

function BudgetForm({ initialCategory, initialAmount, initialSpent, onSave, onCancel }) {
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: {
      category: initialCategory || expenseCategories[0],
      amount: initialAmount !== undefined ? initialAmount : "",
      spent: initialSpent !== undefined ? initialSpent : "0",
    },
    validate: validateBudget,
    onSubmit: (formValues) => {
      onSave({
        category: formValues.category,
        amount: Number(formValues.amount),
        spent: formValues.spent !== "" ? Number(formValues.spent) : 0,
      });
    },
  });

  return (
    <form className="inline-edit-form budget-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Category
          <select
            className={touched.category && errors.category ? "input-error" : ""}
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            onBlur={() => handleBlur("category")}
          >
            {expenseCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <span className="form-field-error">{errors.category}</span>
          )}
        </label>

        <label>
          Monthly Limit (₹) *
          <input
            type="number"
            min="1"
            step="100"
            className={touched.amount && errors.amount ? "input-error" : ""}
            placeholder="e.g. 6000"
            value={values.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            onBlur={() => handleBlur("amount")}
          />
          {touched.amount && errors.amount && (
            <span className="form-field-error">{errors.amount}</span>
          )}
        </label>

        <label>
          Spent Over The Days (₹)
          <input
            type="number"
            min="0"
            step="any"
            className={touched.spent && errors.spent ? "input-error" : ""}
            placeholder="e.g. 500"
            value={values.spent}
            onChange={(e) => handleChange("spent", e.target.value)}
            onBlur={() => handleBlur("spent")}
          />
          {touched.spent && errors.spent && (
            <span className="form-field-error">{errors.spent}</span>
          )}
        </label>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid && Object.keys(touched).length > 0}
        >
          Save Budget
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;
