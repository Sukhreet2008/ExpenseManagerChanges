import Chart from "./Chart.jsx";

// A tiny wrapper: just a card with a heading and a Chart inside it.
// Pulling this out means Dashboard.jsx and Analytics.jsx don't have to
// repeat the same "<div className='card'><h2>...</h2><Chart .../></div>"
// markup over and over.

function ChartCard({ title, data, direction, color, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <Chart data={data} direction={direction} color={color} />
      {children}
    </div>
  );
}

export default ChartCard;
