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

            let [searched] = await Promise.all([search(query, 20)]);
            if (searched.error) return setSearchedBooks([]);

            const complete = searched.map(book => {
                return (Object.values(bookShelves).flat().find(({ id }) => id === book.id)) ?? { ...book, shelf: "none" };
            });

            setSearchedBooks(complete);
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
    const { searchedBooks, onQuery, resetQuery } = useSearchPage({ bookShelves, onMoveBook });

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