// The top row of the Transactions page: the search box, the sort
// dropdown, and the button that shows/hides the filter panel.
// All the actual state lives in Transactions.jsx — this component
// just displays the controls and calls the functions it's given.

function SearchBar({
  searchText,
  onSearchChange,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
}) {
  return (
    <div className="search-row">
      <input
        type="text"
        className="search-input"
        placeholder="Search transactions by title..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="amountHigh">Amount: High to Low</option>
        <option value="amountLow">Amount: Low to High</option>
        <option value="titleAZ">Title: A-Z</option>
        <option value="titleZA">Title: Z-A</option>
      </select>

      <button className="btn btn-secondary" onClick={onToggleFilters}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
    </div>
  );
}

export default SearchBar;
