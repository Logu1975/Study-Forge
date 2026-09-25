/**
 * main.tsx - the client's entry point.
 * It finds the <div id="root"> in index.html and mounts the React app into it.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find the #root element in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
