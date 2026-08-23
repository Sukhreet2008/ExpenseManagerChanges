// The Expense/Income toggle at the top of the transaction form.
// Pulled out on its own since it's a distinct, reusable little control.

function TypeSwitch({ value, onChange }) {
  return (
    <div className="type-switch">
      <button
        type="button"
        className={value === "expense" ? "active" : ""}
        onClick={() => onChange("expense")}
      >
        Expense
      </button>
      <button
        type="button"
        className={value === "income" ? "active" : ""}
        onClick={() => onChange("income")}
      >
        Income
      </button>
    </div>
  );
}

export default TypeSwitch;
