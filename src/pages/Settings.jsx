// The Settings page lets the user change the theme and clear all
// transaction data. All of the real logic lives in App.jsx, this
// component just displays buttons and calls the functions it receives.

function Settings({ theme, onToggleTheme, onClearData, transactionCount }) {
  function handleClearData() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all transactions? This cannot be undone."
    );

    if (confirmed) {
      onClearData();
    }
  }

  return (
    <div className="page">
      <h1>Settings</h1>

      <div className="card">
        <h2>Appearance</h2>
        <p className="settings-description">Choose how the app looks.</p>
        <div className="theme-options">
          <button
            className={"theme-option" + (theme === "light" ? " active" : "")}
            onClick={() => theme !== "light" && onToggleTheme()}
          >
            ☀️ Light Mode
          </button>
          <button
            className={"theme-option" + (theme === "dark" ? " active" : "")}
            onClick={() => theme !== "dark" && onToggleTheme()}
          >
            🌙 Dark Mode
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Data</h2>
        <p className="settings-description">
          You currently have <strong>{transactionCount}</strong> saved transactions.
          All data is stored only in this browser using Local Storage.
        </p>
        <button className="btn btn-danger" onClick={handleClearData}>
          Clear All Transactions
        </button>
      </div>

      <div className="card">
        <h2>About</h2>
        <p className="settings-description">
          <strong>Expense Manager</strong> is a simple personal finance app built
          with React and Vite. It helps you track income and expenses, view your
          balance, and understand your spending through basic analytics.
        </p>
        <p className="settings-description">Version 1.0.0</p>
      </div>
    </div>
  );
}

export default Settings;
