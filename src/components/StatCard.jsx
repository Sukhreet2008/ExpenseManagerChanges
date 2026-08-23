// A simple reusable card used on the Dashboard to show one statistic,
// e.g. Total Balance, Total Income, or Total Expense.

function StatCard({ label, value, icon, type }) {
  // "type" controls the color accent: "income", "expense", "balance", "neutral"
  return (
    <div className={"stat-card stat-" + (type || "neutral")}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export default StatCard;
