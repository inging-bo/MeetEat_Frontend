import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";
import Modal from "./components/modal/ModalContainer.jsx";

function App() {
  return (
    <BrowserRouter>
      <section className="relative flex h-svh w-full min-w-[320px] flex-col items-center">
        <Router />
      </section>
      <Modal />
    </BrowserRouter>
  );
}

export default App;
