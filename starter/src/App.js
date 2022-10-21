import "./App.css";
import { useEffect, useState } from "react";
import { get, getAll, update } from "./api/books.js";
import BookPage from "./view/BookPage";
import SearchPage from "./view/SearchPage";

const useApp = () => {
    const [route, setRoute] = useState(false);
    const [bookShelves, setBookShelves] = useState({ currentlyReading: [], wantToRead: [], read: [] });

    useEffect(() => {
        (async () => {
            const temp = { currentlyReading: [], wantToRead: [], read: [] };
            const books = await getAll();
            for (const book of books) {
                if (!temp[book.shelf]) {
                    temp[book.shelf] = [book];
                } else {
                    temp[book.shelf] = [...temp[book.shelf], book];
                }
            }
            setBookShelves(temp);
        })();
    }, []);

    /**
     * Function name `onMoveBook` is just a placeholder, subject to change
     * @param {{book: any, shelf:string}} param0 
     */
    const onMoveBook = async ({ book, shelf }) => {
        const { currentlyReading, wantToRead, read } = await update(book, shelf);
        /* NOTE this is much slower than my old implementation but seems to work anyway */
        const books = await Promise.all([...currentlyReading, ...wantToRead, ...read].map(get));
        const temp = { currentlyReading: [], wantToRead: [], read: [] };
        for (const book of books) {
            if (!temp[book.shelf]) {
                temp[book.shelf] = [book];
            } else {
                temp[book.shelf] = [...temp[book.shelf], book];
            }
        }
        setBookShelves(temp);
    };

    return {
        route,
        onRoute: () => setRoute(!route),
        bookShelves,
        onMoveBook,
    };
};

function App() {
    const { route, onRoute, bookShelves, onMoveBook } = useApp();

    return (
        <div className="app">
            {route ? <SearchPage  {...{ onRoute, bookShelves, onMoveBook }} /> : <BookPage  {...{ onRoute, bookShelves, onMoveBook }} />}
        </div>
    );
}

export default App;