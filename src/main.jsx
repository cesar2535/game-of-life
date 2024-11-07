import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";

async function main() {
  const element = document.getElementById("root");
  const root = createRoot(element);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

main();
