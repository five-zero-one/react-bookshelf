/* eslint-disable jsx-a11y/anchor-is-valid */
import "./App.css";
import { useEffect, useState } from "react";
import { getBookShelf } from "./api/books";

const { log } = console;

const useApp = () => {
    const [route, setRoute] = useState(false);
    const [currentShelf, setCurrentShelf] = useState(new Map());

    useEffect(() => {
        (async () => {
            for (const book of (await getBookShelf()))
                setCurrentShelf(prevShelf => new Map(prevShelf.set(book.id, book)));
        })();
    }, []);

    const handleRoute = () => setRoute(!route);

    return { route, handleRoute, currentShelf, setCurrentShelf };
};

export default function App() {
    const { handleRoute, route, currentShelf } = useApp();

    return (
        <div className="app">
            {route ? (<SearchPage {...{ handleRoute, currentShelf }} />) : (<BookPage {...{ handleRoute, currentShelf }} />)}
        </div>
    );
}

const useSearchPage = (currentShelf) => {
    return { foo: false };
};

function SearchPage({ handleRoute, currentShelf }) {
    const { foo } = useSearchPage(currentShelf);



    return (
        <div className="search-books">
            <div className="search-books-bar">
                <a
                    className="close-search"
                    onClick={handleRoute}
                >
                    Close
                </a>
                <div className="search-books-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN"
                    />
                </div>
            </div>
            <div className="search-books-results">
                <ol className="books-grid"></ol>
            </div>
        </div>
    );
}

const useBookPage = ({ currentShelf }) => {
    // const [readShelf, setReadShelf] = useState(new Map());
    const [categories, setCategories] = useState(new Map([["read", new Map()], ["wantToRead", new Map()], ["currentlyReading", new Map()]]));


    useEffect(() => {
        for (const [, book] of [...currentShelf])
            setCategories(prevCategories =>
                new Map(prevCategories.set(book.shelf, prevCategories.get(book.shelf).set(book.id, book))));
    }, [currentShelf]);

    return { categories };
};

function BookPage({ handleRoute, currentShelf }) {
    const { categories } = useBookPage({ currentShelf });

    return (
        <div className="list-books">
            <div className="list-books-title">
                <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
                <div>
                    <BookShelf title="Currently Reading" bookShelf={[...categories.get("currentlyReading")]} />
                    <BookShelf title="Want To Read" bookShelf={[...categories.get("wantToRead")]} />
                    <BookShelf title="Read" bookShelf={[...categories.get("read")]} />
                </div>
            </div>
            <div className="open-search">
                <a onClick={handleRoute}>Add a book</a>
            </div>
        </div>
    );
}

function BookShelf({ title, bookShelf }) {
    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{title}</h2>
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {bookShelf.map(([, book]) => (
                        <li key={book.id}><Book {...{ book }} /></li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

/** Book
 * 
 * { title, subtitle, shelf, id, imageLinks: { thumbnail } }
 * 
 */

function Book({ book }) {
    return (
        <div className="book">
            <div className="book-top">
                <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url("${book.imageLinks?.thumbnail}")` }}></div>
                <div className="book-shelf-changer">
                    <select>
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