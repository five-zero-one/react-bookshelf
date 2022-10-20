import "./App.css";
import { useEffect, useState } from "react";
import { get, getAll, search, update } from "./api/books.js";

const { log: $, table: t } = console;

const useBook = ({ book, __foobar__ }) => {
    /* NOTE coercing the value of book to `none` if it is undefined.
    There may be a better away to deal with this but for now this is ok */
    const [shelf, setShelf] = useState(book.shelf ?? (book.shelf = "none"));

    useEffect(() => {
        (async () => {
            /* NOTE I shouldn't need to check if the value is undefined
            as that is being resolved in the useState function */
            // $(`before :: book.shelf = ${book.shelf}; shelf = ${shelf}`);
            if (book.shelf !== shelf) {
                __foobar__({ book, shelf: (book.shelf = shelf) });
            }
            // $(`after :: book.shelf = ${book.shelf}; shelf = ${shelf}`);
        })();
    }, [shelf, book, __foobar__]);

    return {
        shelf,
        onUpdateShelf: (e) => setShelf(e.target.value ?? "none")
    };
};

function Book({ book, __foobar__ }) {
    const { shelf, onUpdateShelf } = useBook({ book, __foobar__ });
    return (
        <div className="book">
            <div className="book-top">
                <div
                    className="book-cover"
                    style={{ width: 128, height: 188, backgroundImage: `url("${book.imageLinks?.thumbnail}")` }}
                ></div>
                <div className="book-shelf-changer">
                    <select value={shelf} onChange={onUpdateShelf}>
                        <option value="none" disabled>
                            Move to...
                        </option>
                        <option value="currentlyReading">
                            Currently Reading
                        </option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                    </select>
                </div>
            </div>
            <div className="book-title">{book.title}</div>
            <div className="book-authors">{book.authors}</div>
        </div>
    );
}

const useApp = () => {
    const [route, setRoute] = useState(true);

    const [query, setQuery] = useState("");
    const [searchedBooks, setSearchedBooks] = useState([]);

    const [bookShelves, setBookShelves] = useState({ currentlyReading: [], wantToRead: [], read: [] });

    useEffect(() => {
        $("app component called");
    }, []);



    useEffect(() => {
        (async () => {
            if (query === "") {
                $("reset searched");
                setSearchedBooks([]);
                return;
            };

            const [searched] = await Promise.all([search(query, 20)]);
            if (searched.error) return setSearchedBooks([]);

            // TODO add results from `getAll`
            $(Object.values(bookShelves).flat());
            for (const book of Object.values(bookShelves).flat()) {
                const found = searched.findIndex(({ id }) => id === book.id);
                if (found > 0) {
                    $(found, book);
                    searched[found].shelf = book.shelf;
                }
            };

            setSearchedBooks(searched);
        })();
    }, [query, bookShelves]);


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
     * Function name `__foobar__` is just a placeholder, subject to change
     * @param {{book: any, shelf:string}} param0 
     */
    const __foobar__ = async ({ book, shelf }) => {
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
        query,
        onQuery: (e) => setQuery(e.target.value ?? "") && (e.target.value = ""),
        resetQuery: () => setQuery(""), // NOTE this is for a bug that I can't seem to fix
        searchedBooks,
        shelvedBooks: bookShelves,
        __foobar__,
    };
};

function App() {
    const { route, onRoute, onQuery, resetQuery, searchedBooks, shelvedBooks, __foobar__ } = useApp();

    return (
        <div className="app">
            {route ? (
                <div className="search-books">
                    <div className="search-books-bar">
                        <button
                            className="close-search"
                            onClick={() => { resetQuery(); onRoute(); }}
                        >
                            Close
                        </button>
                        <div className="search-books-input-wrapper">
                            <input
                                onChange={onQuery}
                                type="text"
                                placeholder="Search by title, author, or ISBN"
                            />
                        </div>
                    </div>
                    <div className="search-books-results">
                        <ol className="books-grid">
                            {searchedBooks.map((book => (<li key={book.id}>
                                <Book {...{ book, __foobar__ }} />
                            </li>)))}
                        </ol>
                    </div>
                </div>
            ) : (
                <div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                        <div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Currently Reading</h2>
                                <div className="bookshelf-books">
                                    <ol className="books-grid">{shelvedBooks.currentlyReading?.map((book => (<li key={book.id}>
                                        <Book {...{ book, __foobar__ }} />
                                    </li>)))}</ol>
                                </div>
                            </div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Want to Read</h2>
                                <div className="bookshelf-books">
                                    <ol className="books-grid">{shelvedBooks.wantToRead?.map((book => (<li key={book.id}>
                                        <Book {...{ book, __foobar__ }} />
                                    </li>)))}</ol>
                                </div>
                            </div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Read</h2>
                                <div className="bookshelf-books">
                                    <ol className="books-grid">{shelvedBooks.read?.map((book => (<li key={book.id}>
                                        <Book {...{ book, __foobar__ }} />
                                    </li>)))}</ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="open-search">
                        <button onClick={onRoute}>Add a book</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;