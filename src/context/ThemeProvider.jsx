import { useState, useEffect } from "react";
import { getTheme, saveTheme } from "../utils/storage.js";
import { ThemeContext } from "./ThemeContext.js";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  function setThemeMode(newTheme) {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
    }
  }

  const value = {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setTheme: setThemeMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;

