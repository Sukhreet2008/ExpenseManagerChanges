import { formatCurrency, getMonthLabel } from "../utils/helpers.js";

// A simple table showing income, expense and balance for each month.
// "rows" is an array of { monthKey, income, expense } objects.

function MonthlyTrendTable({ rows }) {
  return (
    <div className="card">
      <h2>Monthly Trend</h2>
      <table className="trend-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expense</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.monthKey}>
              <td>{getMonthLabel(row.monthKey)}</td>
              <td className="text-income">{formatCurrency(row.income)}</td>
              <td className="text-expense">{formatCurrency(row.expense)}</td>
              <td>{formatCurrency(row.income - row.expense)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MonthlyTrendTable;
