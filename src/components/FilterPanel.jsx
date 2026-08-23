import { allCategories } from "../utils/helpers.js";

// The expandable filter grid on the Transactions page: type, category,
// date, and min/max amount. "filters" holds the current values,
// "onChange" updates a single field, and "onClear" resets everything.

function FilterPanel({ filters, onChange, onClear, hasActiveFilters }) {
  return (
    <div className="filters-grid">
      <label>
        Type
        <select value={filters.type} onChange={(e) => onChange("type", e.target.value)}>
          <option value="All">All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </label>

      <label>
        Category
        <select
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="All">All</option>
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onChange("date", e.target.value)}
        />
      </label>

      <label>
        Min Amount
        <input
          type="number"
          min="0"
          value={filters.minAmount}
          onChange={(e) => onChange("minAmount", e.target.value)}
          placeholder="0"
        />
      </label>

      <label>
        Max Amount
        <input
          type="number"
          min="0"
          value={filters.maxAmount}
          onChange={(e) => onChange("maxAmount", e.target.value)}
          placeholder="No limit"
        />
      </label>

      {hasActiveFilters && (
        <button className="btn btn-secondary clear-btn" onClick={onClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterPanel;
