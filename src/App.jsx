import './App.css'
import {BrowserRouter} from "react-router-dom";
import Router from "./router/router";
import Header from "./components/layout/Header";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Router/>
        </BrowserRouter>
    )
}

export default App
