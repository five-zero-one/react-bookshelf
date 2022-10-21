import { useEffect, useState } from "react";

const useBook = ({ book, onMoveBook }) => {
    /* NOTE coercing the value of book to `none` if it is undefined.
    There may be a better away to deal with this but for now this is ok */
    const [shelf, setShelf] = useState(book.shelf);

    useEffect(() => {
        (async () => {
            /* NOTE I shouldn't need to check if the value is undefined
            as that is being resolved in the useState function */
            if (book.shelf !== shelf) {
                onMoveBook({ book, shelf: (book.shelf = shelf) });
            }
        })();
    }, [shelf, book, onMoveBook]);

    return {
        shelf,
        onUpdateShelf: (e) => setShelf(e.target.value ?? "none")
    };
};

export default function Book({ book, onMoveBook }) {
    const { shelf, onUpdateShelf } = useBook({ book, onMoveBook });
    return (
        <div className="book">
            <div className="book-top">
                <div
                    className="book-cover"
                    style={{ width: 128, height: 188, backgroundImage: `url("${book.imageLinks?.thumbnail}")` }}
                ></div>
                <div className="book-shelf-changer">
                    <select value={shelf} onChange={onUpdateShelf}>
                        <option disabled>
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
