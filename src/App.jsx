import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";
import Modal from './components/modal/ModalContainer.jsx';

function App() {
  return (
    <BrowserRouter>
      <section className="relative flex flex-col justify-center items-center w-full h-dvh">
        <Router />
      </section>
      <Modal/>
    </BrowserRouter>
  );
}

export default App;
