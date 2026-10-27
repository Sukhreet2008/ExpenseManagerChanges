import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../context/ThemeContext.js";
import { useToast } from "../context/ToastContext.js";
import {
  selectAllTransactions,
  clearAllTransactions,
  importTransactions,
} from "../store/transactionsSlice.js";
import { selectCategoryBudgets } from "../store/budgetSlice.js";

function Settings() {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const transactions = useSelector(selectAllTransactions);
  const categoryBudgets = useSelector(selectCategoryBudgets);

  const [importError, setImportError] = useState("");
  const [importSummary, setImportSummary] = useState(null);

  function handleClearData() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all transactions? This cannot be undone."
    );

    if (confirmed) {
      dispatch(clearAllTransactions());
      showToast("All transaction data has been cleared.", "info");
    }
  }

  // Export all data as a downloadable JSON file
  function handleExportData() {
    const backupData = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      transactions,
      categoryBudgets,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Data backup downloaded successfully!", "success");
  }

  // Handle file selection and client-side JSON validation
  function handleFileChange(event) {
    const file = event.target.files[0];
    setImportError("");
    setImportSummary(null);

    if (!file) {
      return;
    }

    if (!file.name.endsWith(".json")) {
      setImportError("Please choose a valid .json backup file.");
      return;
    }

    // Read and validate file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const records = Array.isArray(parsed) ? parsed : parsed.transactions;

        if (!Array.isArray(records)) {
          setImportError("Invalid backup format: Could not find transactions list.");
          return;
        }

        // Validate first few items
        const isValid = records.every(
          (item) => item.title && item.amount && item.type && item.date
        );

        if (!isValid) {
          setImportError("File contains invalid transaction records missing required fields.");
          return;
        }

        setImportSummary({ count: records.length, data: records });
      } catch {
        setImportError("Failed to parse JSON file. File may be corrupted.");
      }
    };
    reader.readAsText(file);
  }

  function handleExecuteImport(event) {
    event.preventDefault();
    if (!importSummary || !importSummary.data) {
      setImportError("Please choose a valid JSON backup file first.");
      return;
    }

    dispatch(importTransactions(importSummary.data));
    showToast(`Successfully imported ${importSummary.count} transactions!`, "success");
    setImportSummary(null);
    setImportError("");
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Configure application preferences, themes, and data backups.</p>
        </div>
      </div>

      <div className="card">
        <h2>Appearance</h2>
        <p className="settings-description">
          Choose between Light Mode and Dark Mode. Managed via <code>ThemeContext</code>.
        </p>
        <div className="theme-options">
          <button
            type="button"
            className={"theme-option" + (theme === "light" ? " active" : "")}
            onClick={() => setTheme("light")}
          >
            ☀️ Light Mode
          </button>
          <button
            type="button"
            className={"theme-option" + (theme === "dark" ? " active" : "")}
            onClick={() => setTheme("dark")}
          >
            🌙 Dark Mode
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Data Backup & Restore</h2>
        <p className="settings-description">
          Export your current data as JSON, or restore transactions from a previous backup file.
        </p>

        <div className="settings-backup-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportData}
            disabled={transactions.length === 0}
          >
            📥 Export Backup (JSON)
          </button>
        </div>

        <form className="import-form" onSubmit={handleExecuteImport}>
          <label>
            Restore from Backup File
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="file-input"
            />
          </label>

          {importError && <p className="form-field-error">{importError}</p>}

          {importSummary && (
            <p className="import-success-msg">
              ✓ Ready to restore <strong>{importSummary.count}</strong> transactions.
            </p>
          )}

          {importSummary && (
            <button type="submit" className="btn btn-primary btn-small">
              Restore Data Now
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <h2>Storage & Reset</h2>
        <p className="settings-description">
          You currently have <strong>{transactions.length}</strong> transactions stored in
          browser Local Storage, synchronized with the Redux Toolkit store.
        </p>
        <button type="button" className="btn btn-danger" onClick={handleClearData}>
          Clear All Transactions
        </button>
      </div>

      <div className="card">
        <h2>About Architecture</h2>
        <p className="settings-description">
          <strong>Expense Manager (Front End Engineering-II)</strong> demonstrates:
        </p>
        <ul className="settings-feature-list">
          <li><strong>React Router v7:</strong> Declarative layouts, NavLink routing, and URL query param filters.</li>
          <li><strong>Context API:</strong> ThemeContext, ToastContext, and ModalContext for global presentation states.</li>
          <li><strong>Redux Toolkit:</strong> transactionsSlice and budgetSlice with centralized reducers and selectors.</li>
          <li><strong>Form Handling:</strong> Custom useForm hook with controlled validation, touch tracking, and error feedback.</li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;
