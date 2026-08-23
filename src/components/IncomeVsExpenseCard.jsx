import Chart from "./Chart.jsx";
import { formatCurrency } from "../utils/helpers.js";

// Shows the Income vs Expense bar chart plus a one-line balance summary
// underneath it. Kept separate from ChartCard because of that extra line.

function IncomeVsExpenseCard({ totalIncome, totalExpense }) {
  const data = [
    { label: "Income", value: totalIncome },
    { label: "Expense", value: totalExpense },
  ];

  return (
    <div className="card">
      <h2>Income vs Expense</h2>
      <Chart data={data} direction="horizontal" color="var(--income)" />
      <p className="analytics-note">
        Balance: <strong>{formatCurrency(totalIncome - totalExpense)}</strong>
      </p>
    </div>
  );
}

export default IncomeVsExpenseCard;
