import Book from "./Book";

export default function BookList({ list, onMoveBook }) {
    return (
        <ol className="books-grid">{list.map((book => (<li key={book.id}>
            <Book {...{ book, onMoveBook }} />
        </li>)))}</ol>
    );
}