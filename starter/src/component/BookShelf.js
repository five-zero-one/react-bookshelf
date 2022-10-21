import BookList from "./BookList";

export default function BookShelf({ title, shelf, onMoveBook }) {
    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{title}</h2>
            <div className="bookshelf-books">
                <BookList list={shelf} onMoveBook={onMoveBook} />
            </div>
        </div>
    );
}