import { Link } from "react-router-dom";
import BookShelf from "../component/BookShelf";

export default function BookPage({ onRoute, books, onMoveBook }) {
    const categories = { currentlyReading: [], wantToRead: [], read: [] };
    for (const book of books) categories[book.shelf].push(book);

    return (
        <div className="list-books">
            <div className="list-books-title">
                <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
                <div>
                    <BookShelf title="Currently Reading" {...{ shelf: categories.currentlyReading, onMoveBook }} />
                    <BookShelf title="Want to Read" {...{ shelf: categories.wantToRead, onMoveBook }} />
                    <BookShelf title="Read" {...{ shelf: categories.read, onMoveBook }} />
                </div>
            </div>
            <div className="open-search">
                <Link to="/search">Add a book</Link>
            </div>
        </div>
    );
}
