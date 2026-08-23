// Navbar shows the app name, the page links, and the dark mode button.
// It does not manage any state itself — it just receives values and
// functions as props from App.jsx and calls them when clicked.

const links = [
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

function Navbar({ currentPage, onNavigate, theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="brand" onClick={() => onNavigate("dashboard")}>
          <span className="brand-icon">₹</span>
          <span className="brand-name">Expense Manager</span>
        </button>

        <nav className="nav-links">
          {links.map((link) => (
            <button
              key={link.id}
              className={"nav-link" + (currentPage === link.id ? " active" : "")}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
