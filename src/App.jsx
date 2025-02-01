import './App.css'
import {BrowserRouter} from "react-router-dom";
import Router from "./router/router";
import Header from "./components/layout/Header";

function App() {
    return (
        <BrowserRouter>
            <header className="flex flex-col justify-center w-full fixed top-0 h-16">
                <Header/>
            </header>
            <section className="flex justify-center items-center w-full h-dvh">
                <Router/>
            </section>
        </BrowserRouter>
    )
}

export default App
