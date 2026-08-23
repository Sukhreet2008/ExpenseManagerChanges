import TransactionItem from "./TransactionItem.jsx";
import EmptyState from "./EmptyState.jsx";

// Renders a list of transactions using TransactionItem for each one.
// If the list is empty, it shows the EmptyState component instead.

function TransactionList({ transactions, onEdit, onDelete, onAddClick }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        message="Try changing your filters, or add a new transaction to get started."
        buttonLabel="Add Transaction"
        onButtonClick={onAddClick}
      />
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TransactionList;
