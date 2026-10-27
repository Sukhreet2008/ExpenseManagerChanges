import { formatCurrency, formatDate } from "../utils/helpers.js";

// Displays a single transaction as a row/card.
// It receives the transaction plus two functions (onEdit, onDelete)
// so it can tell the parent component what the user clicked.

function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === "income";

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (confirmed) {
      onDelete(transaction.id);
    }
  }

  return (
    <div className="transaction-item">
      <div className={"transaction-icon " + (isIncome ? "icon-income" : "icon-expense")}>
        {isIncome ? "↓" : "↑"}
      </div>

      <div className="transaction-details">
        <p className="transaction-title">{transaction.title}</p>
        <p className="transaction-meta">
          {transaction.category} • {formatDate(transaction.date)}
          {transaction.paymentMethod ? ` • ${transaction.paymentMethod}` : ""}
          {transaction.tag ? ` • [${transaction.tag}]` : ""}
        </p>
        {transaction.description && (
          <p className="transaction-description">{transaction.description}</p>
        )}
      </div>

      <div className="transaction-right">
        <p className={"transaction-amount " + (isIncome ? "text-income" : "text-expense")}>
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>

        <div className="transaction-actions">
          <button className="icon-btn" onClick={() => onEdit(transaction)} title="Edit">
            ✏️
          </button>
          <button className="icon-btn" onClick={handleDelete} title="Delete">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionItem;
