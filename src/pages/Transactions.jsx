import { useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import TransactionList from "../components/TransactionList.jsx";

// The Transactions page owns all the filter/sort STATE and does the
// actual filtering/sorting logic. The controls themselves are broken
// out into SearchBar and FilterPanel so this file stays focused on
// "what should be shown", not "how does each input look".

const emptyFilters = {
  type: "All",
  category: "All",
  date: "",
  minAmount: "",
  maxAmount: "",
};

function Transactions({ transactions, onEdit, onDelete, onAddClick }) {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Update a single filter field, e.g. updateFilter("category", "Food").
  function updateFilter(field, value) {
    setFilters({ ...filters, [field]: value });
  }

  function clearFilters() {
    setSearchText("");
    setFilters(emptyFilters);
  }

  const hasActiveFilters =
    searchText ||
    filters.type !== "All" ||
    filters.category !== "All" ||
    filters.date ||
    filters.minAmount ||
    filters.maxAmount;

  // Start with all transactions, then keep only the ones that match
  // every active filter, using filter().
  let filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filters.type === "All" || t.type === filters.type.toLowerCase();
    const matchesCategory = filters.category === "All" || t.category === filters.category;
    const matchesDate = !filters.date || t.date === filters.date;
    const matchesMin = !filters.minAmount || t.amount >= Number(filters.minAmount);
    const matchesMax = !filters.maxAmount || t.amount <= Number(filters.maxAmount);

    return matchesSearch && matchesType && matchesCategory && matchesDate && matchesMin && matchesMax;
  });

  // Sort the filtered list using sort(). We copy the array first with
  // [...array] so we don't accidentally change the original order.
  filteredTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "amountHigh") return b.amount - a.amount;
    if (sortBy === "amountLow") return a.amount - b.amount;
    if (sortBy === "titleAZ") return a.title.localeCompare(b.title);
    if (sortBy === "titleZA") return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Transactions</h1>
        <button className="btn btn-primary" onClick={onAddClick}>
          + Add Transaction
        </button>
      </div>

      <div className="card">
        <SearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {showFilters && (
          <FilterPanel
            filters={filters}
            onChange={updateFilter}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </div>

      <p className="result-count">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </p>

      <TransactionList
        transactions={filteredTransactions}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddClick={onAddClick}
      />
    </div>
  );
}

export default Transactions;
