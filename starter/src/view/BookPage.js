import Book from "../component/Book";

export default function BookPage({ onRoute, bookShelves, onMoveBook }) {
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
                            <ol className="books-grid">{bookShelves.currentlyReading?.map((book => (<li key={book.id}>
                                <Book {...{ book, onMoveBook }} />
                            </li>)))}</ol>
                        </div>
                    </div>
                    <div className="bookshelf">
                        <h2 className="bookshelf-title">Want to Read</h2>
                        <div className="bookshelf-books">
                            <ol className="books-grid">{bookShelves.wantToRead?.map((book => (<li key={book.id}>
                                <Book  {...{ book, onMoveBook }} />
                            </li>)))}</ol>
                        </div>
                    </div>
                    <div className="bookshelf">
                        <h2 className="bookshelf-title">Read</h2>
                        <div className="bookshelf-books">
                            <ol className="books-grid">{bookShelves.read?.map((book => (<li key={book.id}>
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