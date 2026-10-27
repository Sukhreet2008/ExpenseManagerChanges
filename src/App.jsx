import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { ToastProvider } from "./context/ToastProvider.jsx";
import { ModalProvider } from "./context/ModalProvider.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Budgets from "./pages/Budgets.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

// App.jsx: Configures the React Navigation / Router hierarchy and Context providers.
// Demonstrates layered architecture:
//   1. Context Providers (ThemeProvider, ToastProvider, ModalProvider)
//   2. BrowserRouter & declarative Routes
//   3. Nested RootLayout with Outlet
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ModalProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
