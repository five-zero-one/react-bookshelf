import "./App.css";
import BookPage from "./view/BookPage";
import SearchPage from "./view/SearchPage";
import { useApp } from "./hook";
import { Route, Routes } from "react-router-dom";

function App() {
    const { route, onRoute, books, onMoveBook } = useApp();

    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<BookPage  {...{ onRoute, books, onMoveBook }} />} />
                <Route path="/search" element={<SearchPage  {...{ onRoute, books, onMoveBook }} />} />
            </Routes>
        </div>
    );
}

export default App;