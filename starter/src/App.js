import "./App.css";
import { useEffect, useState } from "react";
import { get, getAll, update } from "./api/books.js";
import BookPage from "./view/BookPage";
import SearchPage from "./view/SearchPage";

const useApp = () => {
    const [route, setRoute] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        (async () => {
            setBooks(await getAll());
        })();
    }, []);

    /**
     * Function name `onMoveBook` is just a placeholder, subject to change
     * @param {{book: any, shelf:string}} param0 
     */
    const onMoveBook = async ({ book, shelf }) => {
        if ((await update(book, shelf))[shelf]?.includes(book.id))
            setBooks(books.filter(({ id }) => id !== book.id).concat((await get(book.id))));
        else
            setBooks(books.filter(({ id }) => id !== book.id));
    };

    return {
        route,
        onRoute: () => setRoute(!route),
        books,
        onMoveBook,
    };
};

function App() {
    const { route, onRoute, books, onMoveBook } = useApp();

    return (
        <div className="app">
            {route ? <SearchPage  {...{ onRoute, books, onMoveBook }} /> : <BookPage  {...{ onRoute, books, onMoveBook }} />}
        </div>
    );
}

export default App;