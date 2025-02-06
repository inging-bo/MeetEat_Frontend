import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (import.meta.env.NODE_ENV !== "development") {
    const { worker } = await import("./mocks/browser.jsx");
    return worker.start();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(<App />);
});
