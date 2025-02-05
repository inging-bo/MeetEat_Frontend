import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (import.meta.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser"); //Dynamic import하는 것이 눈에 띄였다.
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(<App />);
});
