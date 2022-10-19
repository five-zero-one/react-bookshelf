import "./App.css";
import { useEffect, useState } from "react";
import { get, search, update } from "./api/books.js";

const { log: $, table: t } = console;

const useBook = ({ book, __foobar__ }) => {
    const [shelf, setShelf] = useState(book.shelf ?? (book.shelf = "none"));

    useEffect(() => {
        (async () => {
            $(`before :: book.shelf = ${book.shelf}; shelf = ${shelf}`);
            if (book.shelf && book.shelf !== shelf) {
                __foobar__({ book, shelf });
                book.shelf = shelf;
            }
            $(`after :: book.shelf = ${book.shelf}; shelf = ${shelf}`);
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

    useEffect(() => {
        $("app component called");
    }, []);

    const [query, setQuery] = useState("");
    const [searchedBooks, setSearchedBooks] = useState([]);

    useEffect(() => {
        (async () => {
            const books = (await search(query, 20) ?? []);
            // TODO add results from `getAll`
            setSearchedBooks(books.error ? [] : books);
        })();
    }, [query]);

    /**
     * Function name `__foobar__` is just a placeholder, subject to change
     * @param {{book: any, shelf:string}} param0 
     */
    const __foobar__ = async ({ book, shelf }) => {
        const { currentlyReading, wantToRead, read } = await update(book, shelf);
        const books = await Promise.all([...currentlyReading, ...wantToRead, ...read].map(get));
        t(books);
    };

    return {
        route,
        onRoute: () => setRoute(!route),
        query,
        onQuery: (e) => setQuery(e.target.value ?? ""),
        searchedBooks,
        __foobar__,
    };
};

function App() {
    const { route, onRoute, onQuery, searchedBooks, __foobar__ } = useApp();

    return (
        <div className="app">
            {route ? (
                <div className="search-books">
                    <div className="search-books-bar">
                        <button
                            className="close-search"
                            onClick={onRoute}
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
                                    <ol className="books-grid">
                                        <li>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div
                                                        className="book-cover"
                                                        style={{
                                                            width: 128,
                                                            height: 193,
                                                            backgroundImage:
                                                                'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")',
                                                        }}
                                                    ></div>
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
                                                <div className="book-title">To Kill a Mockingbird</div>
                                                <div className="book-authors">Harper Lee</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div
                                                        className="book-cover"
                                                        style={{
                                                            width: 128,
                                                            height: 188,
                                                            backgroundImage:
                                                                'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")',
                                                        }}
                                                    ></div>
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
                                                <div className="book-title">Ender's Game</div>
                                                <div className="book-authors">Orson Scott Card</div>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Want to Read</h2>
                                <div className="bookshelf-books">
                                    <ol className="books-grid">
                                        <li>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div
                                                        className="book-cover"
                                                        style={{
                                                            width: 128,
                                                            height: 193,
                                                            backgroundImage:
                                                                'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")',
                                                        }}
                                                    ></div>
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
                                                <div className="book-title">1776</div>
                                                <div className="book-authors">David McCullough</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div
                                                        className="book-cover"
                                                        style={{
                                                            width: 128,
                                                            height: 192,
                                                            backgroundImage:
                                                                'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api")',
                                                        }}
                                                    ></div>
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
                                                <div className="book-title">
                                                    Harry Potter and the Sorcerer's Stone
                                                </div>
                                                <div className="book-authors">J.K. Rowling</div>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Read</h2>
                                <div className="bookshelf-books">
                                    <ol className="books-grid">
                                        <li>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div
                                                        className="book-cover"
                                                        style={{
                                                            width: 128,
                                                            height: 192,
                                                            backgroundImage:
                                                                'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api")',
                                                        }}
                                                    ></div>
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
                                                <div className="book-title">The Hobbit</div>
                                                <div className="book-authors">J.R.R. Tolkien</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div
                                                        className="book-cover"
                                                        style={{
                                                            width: 128,
                                                            height: 174,
                                                            backgroundImage:
                                                                'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api")',
                                                        }}
                                                    ></div>
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
                                                <div className="book-title">
                                                    Oh, the Places You'll Go!
                                                </div>
                                                <div className="book-authors">Seuss</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div
                                                        className="book-cover"
                                                        style={{
                                                            width: 128,
                                                            height: 192,
                                                            backgroundImage:
                                                                'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api")',
                                                        }}
                                                    ></div>
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
                                                <div className="book-title">
                                                    The Adventures of Tom Sawyer
                                                </div>
                                                <div className="book-authors">Mark Twain</div>
                                            </div>
                                        </li>
                                    </ol>
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