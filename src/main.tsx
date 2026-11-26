import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LmsProvider } from "./contexts/LmsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <LmsProvider>
        <App />
      </LmsProvider>
    </ErrorBoundary>
  </StrictMode>
);
