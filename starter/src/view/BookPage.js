import Book from "../component/Book";

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
                    <div className="bookshelf">
                        <h2 className="bookshelf-title">Currently Reading</h2>
                        <div className="bookshelf-books">
                            <ol className="books-grid">{categories.currentlyReading.map((book => (<li key={book.id}>
                                <Book {...{ book, onMoveBook }} />
                            </li>)))}</ol>
                        </div>
                    </div>
                    <div className="bookshelf">
                        <h2 className="bookshelf-title">Want to Read</h2>
                        <div className="bookshelf-books">
                            <ol className="books-grid">{categories.wantToRead.map((book => (<li key={book.id}>
                                <Book  {...{ book, onMoveBook }} />
                            </li>)))}</ol>
                        </div>
                    </div>
                    <div className="bookshelf">
                        <h2 className="bookshelf-title">Read</h2>
                        <div className="bookshelf-books">
                            <ol className="books-grid">{categories.read.map((book => (<li key={book.id}>
                                <Book {...{ book, onMoveBook }} />
                            </li>)))}</ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="open-search">
                <button onClick={onRoute}>Add a book</button>
            </div>
        </div>
    );
}