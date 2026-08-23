import { formatCurrency } from "../utils/helpers.js";

// A simple bar chart built with plain HTML and CSS (no chart library).
// "data" should look like: [{ label: "Food", value: 4500 }, ...]
//
// direction="horizontal" -> bars grow left to right (good for categories)
// direction="vertical"   -> bars grow bottom to top (good for months/weeks)

function Chart({ data, direction = "horizontal", color = "var(--accent)" }) {
  if (!data || data.length === 0) {
    return <p className="chart-empty">Not enough data yet.</p>;
  }

  // Find the biggest value so we can calculate each bar's percentage size.
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  if (direction === "vertical") {
    return (
      <div className="chart chart-vertical">
        {data.map((item) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div className="v-bar-wrapper" key={item.label}>
              <div className="v-bar-value">{formatCurrency(item.value)}</div>
              <div className="v-bar-track">
                <div
                  className="v-bar-fill"
                  style={{ height: heightPercent + "%", background: color }}
                ></div>
              </div>
              <div className="v-bar-label">{item.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="chart chart-horizontal">
      {data.map((item) => {
        const widthPercent = (item.value / maxValue) * 100;
        return (
          <div className="h-bar-row" key={item.label}>
            <div className="h-bar-label">{item.label}</div>
            <div className="h-bar-track">
              <div
                className="h-bar-fill"
                style={{ width: widthPercent + "%", background: color }}
              ></div>
            </div>
            <div className="h-bar-value">{formatCurrency(item.value)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Chart;
