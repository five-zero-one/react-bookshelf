import { Link } from "react-router-dom";
import BookList from "../component/BookList";
import { useSearch } from "../hook";


export default function SearchPage({ books, onMoveBook }) {
    const { searchedBooks, onQuery } = useSearch({ books, onMoveBook });

    return (
        <div className="search-books">
            <div className="search-books-bar">
                <Link to="/" className="close-search">Close</Link>
                <div className="search-books-input-wrapper">
                    <input
                        onChange={onQuery}
                        type="text"
                        placeholder="Search by title, author, or ISBN"
                    />
                </div>
            </div>
            <div className="search-books-results">
                <BookList list={searchedBooks} onMoveBook={onMoveBook} />
            </div>
        </div>
    );
}