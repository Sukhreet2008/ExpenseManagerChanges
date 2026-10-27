import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.js";

// Navbar: Top-level navigation component powered by React Router NavLink.
// Features active route highlighting, semantic routing, and context-based theme toggling.
const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/transactions", label: "Transactions" },
  { path: "/budgets", label: "Budgets" },
  { path: "/analytics", label: "Analytics" },
  { path: "/settings", label: "Settings" },
];

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-icon">₹</span>
          <span className="brand-name">Expense Manager</span>
        </NavLink>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle light/dark mode"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
