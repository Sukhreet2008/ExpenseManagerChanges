import TransactionItem from "./TransactionItem.jsx";

// Shows a short list of the most recent transactions inside a card.
// Dashboard.jsx works out *which* transactions to show (the calculation);
// this component just worries about *displaying* them.

function RecentTransactions({ transactions, onEdit, onDelete }) {
  return (
    <div className="card">
      <h2>Recent Transactions</h2>
      {transactions.map((t) => (
        <TransactionItem key={t.id} transaction={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default RecentTransactions;
