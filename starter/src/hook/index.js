import { useEffect, useState } from "react";
import { get, getAll, search, update } from "../api/book";

export const useBook = ({ book, onMoveBook }) => {
    const [shelf, setShelf] = useState(book.shelf);

    useEffect(() => {
        (async () => {
            book.shelf !== shelf &&
                onMoveBook({ book, shelf });
        })();
    }, [shelf, book, onMoveBook]);

    return {
        shelf,
        onUpdateShelf: (e) => setShelf(e.target.value)
    };
};


export const useSearch = ({ books }) => {
    const [query, setQuery] = useState("");
    const [searchedBooks, setSearchedBooks] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await search(query, 10);

            if (result && !result.error)
                setSearchedBooks(result.map(book =>
                    books.find(({ id }) => id === book.id) ?? { ...book, shelf: "none" }));
            else
                setSearchedBooks([]);
        })();
    }, [query, books]);

    return {
        searchedBooks,
        query,
        onQuery: (e) => setQuery(e.target.value),
    };
};


export const useApp = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        (async () => {
            setBooks(await getAll());
        })();
    }, []);

    /**
     * Function name `onMoveBook` is just a placeholder, subject to change
     * @param {{book: any, shelf:string}} param0 
     */
    const onMoveBook = async ({ book, shelf }) => {
        if ((await update(book, shelf))[shelf]?.includes(book.id))
            setBooks(books.filter(({ id }) => id !== book.id).concat((await get(book.id))));
        else
            setBooks(books.filter(({ id }) => id !== book.id));
    };

    return {
        books,
        onMoveBook,
    };
};