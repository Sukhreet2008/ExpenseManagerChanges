import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { selectAllTransactions, deleteTransaction } from "../store/transactionsSlice.js";
import { useModal } from "../context/ModalContext.js";
import { useToast } from "../context/ToastContext.js";

const emptyFilters = {
  type: "All",
  category: "All",
  date: "",
  minAmount: "",
  maxAmount: "",
};

function Transactions(props) {
  const reduxTransactions = useSelector(selectAllTransactions);
  const transactions = props.transactions || reduxTransactions;

  const dispatch = useDispatch();
  const { openAddTransaction, openEditTransaction } = useModal();
  const { showToast } = useToast();

  const handleAddClick = props.onAddClick || openAddTransaction;
  const handleEdit = props.onEdit || openEditTransaction;
  const handleDelete =
    props.onDelete ||
    ((id) => {
      dispatch(deleteTransaction(id));
      showToast("Transaction deleted successfully", "info");
    });

  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get("search") || "";
  const queryType = searchParams.get("type") || "All";

  const [searchText, setSearchText] = useState(querySearch);
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    type: queryType !== "All" ? queryType : "All",
  }));
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function clearFilters() {
    setSearchText("");
    setFilters(emptyFilters);
    setSearchParams({});
  }

  const hasActiveFilters =
    searchText ||
    filters.type !== "All" ||
    filters.category !== "All" ||
    filters.date ||
    filters.minAmount ||
    filters.maxAmount;

  // Filter pipeline
  let filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchText.toLowerCase())) ||
      (t.paymentMethod && t.paymentMethod.toLowerCase().includes(searchText.toLowerCase())) ||
      (t.tag && t.tag.toLowerCase().includes(searchText.toLowerCase()));

    const matchesType = filters.type === "All" || t.type === filters.type.toLowerCase();
    const matchesCategory = filters.category === "All" || t.category === filters.category;
    const matchesDate = !filters.date || t.date === filters.date;
    const matchesMin = !filters.minAmount || Number(t.amount) >= Number(filters.minAmount);
    const matchesMax = !filters.maxAmount || Number(t.amount) <= Number(filters.maxAmount);

    return matchesSearch && matchesType && matchesCategory && matchesDate && matchesMin && matchesMax;
  });

  // Sort pipeline
  filteredTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "amountHigh") return Number(b.amount) - Number(a.amount);
    if (sortBy === "amountLow") return Number(a.amount) - Number(b.amount);
    if (sortBy === "titleAZ") return a.title.localeCompare(b.title);
    if (sortBy === "titleZA") return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p className="page-subtitle">Search, filter, and audit all your records.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          + Add Transaction
        </button>
      </div>

      <div className="card">
        <SearchBar
          searchText={searchText}
          onSearchChange={(val) => {
            setSearchText(val);
            if (val) {
              setSearchParams({ search: val });
            } else {
              setSearchParams({});
            }
          }}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={handleAddClick}
      />
    </div>
  );
}

export default Transactions;
