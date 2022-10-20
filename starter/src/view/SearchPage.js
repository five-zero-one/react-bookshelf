import { useEffect, useState } from "react";
import { search } from "../api/books";
import Book from "../component/Book";

const useSearchPage = ({ bookShelves }) => {
    const [query, setQuery] = useState("");
    const [searchedBooks, setSearchedBooks] = useState([]);

    useEffect(() => {
        (async () => {
            if (query === "") {
                setSearchedBooks([]);
                return;
            };

            const [searched] = await Promise.all([search(query, 20)]);
            if (searched.error) return setSearchedBooks([]);

            // TODO add results from `getAll`
            for (const book of Object.values(bookShelves).flat()) {
                const found = searched.findIndex(({ id }) => id === book.id);
                if (found > 0) {
                    searched[found].shelf = book.shelf;
                }
            };

            setSearchedBooks(searched);
        })();
    }, [query, bookShelves]);

    return {
        searchedBooks,
        query,
        onQuery: (e) => setQuery(e.target.value ?? "") && (e.target.value = ""),
        resetQuery: () => setQuery(""), // NOTE this is for a bug that I can't seem to fix
    };
};

export default function SearchPage({ onRoute, bookShelves, onMoveBook }) {
    const { searchedBooks, onQuery, resetQuery } = useSearchPage({ bookShelves });

    return (
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
                        <Book  {...{ book, onMoveBook }} />
                    </li>)))}
                </ol>
            </div>
        </div>
    );
}