import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerPwaServiceWorker } from "./lib/pwa";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerPwaServiceWorker(import.meta.env.BASE_URL);
