import React, { useContext, useState, useEffect } from "react";
import Book from "./Book";
import { UserContext } from "../providers/UserProvider";
import axios from "axios";
import ReactGA from "react-ga";

const api = process.env.REACT_APP_API;

const Books = () => {
  const { user } = useContext(UserContext);
  const { cards } = user;
  const [books, setBooks] = useState([]);

  useEffect(
    () => {
      ReactGA.event({
        category: "Books",
        action: "List books",
      });
      Promise.all(
        cards
          // remove card in error or with fine to avoid reaction loop
          .filter((c) => c.error === undefined)
          .filter((c) => c.fine === undefined)
          .map((card) =>
            axios
              .get(`${api}books`, {
                params: {
                  code: card.code,
                  pin: card.pin,
                },
              })
              .then((res) => {
                // add card info to the book
                return res.data.books.map((book) => {
                  book.card = card;
                  return book;
                });
              })
              .catch((err) => {
                // if error during books call then return an empty array
                return [];
              })
          )
      ).then((data) => {
        // flatten and order by due-date the list after

        setBooks(
          data.flat().sort((a, b) => {
            if (a.duedate > b.duedate) {
              return 1;
            } else {
              return -1;
            }
          })
        );
      });
    },
    [cards] /* refresh only if cards is changing not books ! */
  );

  return (
    <div className="mt-4">
      <div className="text-3xl font-extrabold text-blue-900">
        {books.length} books
      </div>
      <hr className="mb-4" />
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {books.map((book) => (
          <Book key={book.barcode} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Books;
