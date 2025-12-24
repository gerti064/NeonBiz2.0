import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./pos/styles/index.css"; // ✅ new split styles entry

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
