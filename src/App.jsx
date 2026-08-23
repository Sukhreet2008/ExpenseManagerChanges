import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import {
  getTransactions,
  saveTransactions,
  getTheme,
  saveTheme,
  getSavingsGoal,
  saveSavingsGoal,
  getMonthlyTargetRate,
  saveMonthlyTargetRate,
} from "./utils/storage.js";

// App.jsx is the top-level component. It is responsible for:
//   1. Holding the main application state (transactions, theme, page)
//   2. Loading/saving that state from/to Local Storage
//   3. Deciding which page to render
//   4. Passing data and functions down to pages as props
//
// The pages themselves only worry about how to *display* things.

const validPages = ["dashboard", "transactions", "analytics", "settings"];

function App() {
  // Store all transactions in React state. We start by reading whatever
  // is already saved in Local Storage (or sample data if there's nothing).
  const [transactions, setTransactions] = useState(() => getTransactions());

  // Store the current theme ("light" or "dark").
  const [theme, setTheme] = useState(() => getTheme());

  // Store the user's overall savings goal amount and their monthly
  // savings-rate target (used on the Analytics > Savings tab).
  const [savingsGoal, setSavingsGoal] = useState(() => getSavingsGoal());
  const [monthlyTargetRate, setMonthlyTargetRate] = useState(() => getMonthlyTargetRate());

  // Store which page is currently visible.
  const [page, setPage] = useState("dashboard");

  // Store whether the Add/Edit Transaction form is open, and which
  // transaction (if any) is being edited.
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Save transactions to Local Storage whenever they change.
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Save the theme to Local Storage whenever it changes, and add/remove
  // the "dark" class on the <html> element so our CSS can react to it.
  useEffect(() => {
    saveTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Save the savings goal / monthly target to Local Storage whenever
  // they change.
  useEffect(() => {
    saveSavingsGoal(savingsGoal);
  }, [savingsGoal]);

  useEffect(() => {
    saveMonthlyTargetRate(monthlyTargetRate);
  }, [monthlyTargetRate]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  // --- Transaction actions -------------------------------------------------

  function openAddForm() {
    setEditingTransaction(null);
    setShowForm(true);
  }

  function openEditForm(transaction) {
    setEditingTransaction(transaction);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTransaction(null);
  }

  function handleSaveTransaction(formData) {
    if (editingTransaction) {
      // Editing: replace the matching transaction, keep everything else the same.
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id ? { ...t, ...formData } : t
        )
      );
    } else {
      // Adding: create a new transaction with a unique id.
      const newTransaction = {
        id: Date.now(),
        ...formData,
      };
      setTransactions([newTransaction, ...transactions]);
    }

    closeForm();
  }

  function handleDeleteTransaction(id) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  function handleClearData() {
    setTransactions([]);
  }

  // --- Page rendering -------------------------------------------------------

  function renderPage() {
    if (page === "dashboard") {
      return (
        <Dashboard
          transactions={transactions}
          onEdit={openEditForm}
          onDelete={handleDeleteTransaction}
          onAddClick={openAddForm}
        />
      );
    }

    if (page === "transactions") {
      return (
        <Transactions
          transactions={transactions}
          onEdit={openEditForm}
          onDelete={handleDeleteTransaction}
          onAddClick={openAddForm}
        />
      );
    }

    if (page === "analytics") {
      return (
        <Analytics
          transactions={transactions}
          savingsGoal={savingsGoal}
          monthlyTargetRate={monthlyTargetRate}
          onUpdateSavingsGoal={setSavingsGoal}
          onUpdateMonthlyTarget={setMonthlyTargetRate}
        />
      );
    }

    if (page === "settings") {
      return (
        <Settings
          theme={theme}
          onToggleTheme={toggleTheme}
          onClearData={handleClearData}
          transactionCount={transactions.length}
        />
      );
    }

    // Fallback: if "page" is not one of the known pages, show 404.
    return <NotFound onGoHome={() => setPage("dashboard")} />;
  }

  const isKnownPage = validPages.includes(page);

  return (
    <div className="app">
      <Navbar
        currentPage={page}
        onNavigate={setPage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main-content">{isKnownPage ? renderPage() : renderPage()}</main>

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <TransactionForm
              editingTransaction={editingTransaction}
              onSave={handleSaveTransaction}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
