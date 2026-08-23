// The row of 4 small stat boxes at the bottom of the Dashboard
// (Total Transactions, Average Expense, Biggest Expense, Savings Rate).
// Takes a simple array of { label, value } pairs so it stays generic.

function QuickStats({ stats }) {
  return (
    <div className="quick-stats">
      {stats.map((stat) => (
        <div className="quick-stat" key={stat.label}>
          <p className="quick-stat-label">{stat.label}</p>
          <p className="quick-stat-value">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default QuickStats;
