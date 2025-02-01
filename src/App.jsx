import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";

function App() {
  return (
    <BrowserRouter>
      <section className="flex flex-col justify-center items-center w-full h-dvh">
        <Router />
      </section>
    </BrowserRouter>
  );
}

export default App;
