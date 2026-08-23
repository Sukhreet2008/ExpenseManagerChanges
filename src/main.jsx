import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

// This is the entry point of the whole application.
// React takes over the <div id="root"></div> from index.html
// and renders our <App /> component inside it.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
