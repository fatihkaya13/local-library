const { parallel } = require("async");

const BookInstance = require("../../models/BookInstance");
const Book = require("../../models/Book");
const async = require("async");

const { body, validationResult } = require("express-validator");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  ch = createClickhouseClient();
  const bookInstanceId = req.params.id;

  const query = `select b.*, i.*
    from locallibrary.book b
    left join locallibrary.book_instance i
    on b.id = i.book_id
    where i.id = '${bookInstanceId}'
    `;

  ch.querying(query, (err, result) => {
    if (err) return next(err);
  }).then((queryResponse) => {
    let results = queryResponse.data;

    results = results.map(
      ([
        book_id,
        title,
        author_id,
        summary,
        isbn,
        genre_id,
        instance_id,
        book_id_2,
        status,
        imprint,
        due_back,
      ]) => {
        return {
          books: [
            {
              genre: genre_id,
              _id: book_id,
              title,
              author: author_id,
              summary,
              isbn,
            },
          ],
          bookinstance: {
            status,
            _id: instance_id,
            imprint,
            due_back,
            book: {
              genre: genre_id,
              _id: book_id,
              author: author_id,
              summary,
              isbn,
            },
          },
        };
      }
    );
    if (results[0].bookinstance == null) {
      // No results.
      var err = new Error("Book copy not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("bookinstance_form", {
      title: "Update  BookInstance",
      book_list: results[0].books,
      selected_book: results[0].bookinstance.book._id,
      bookinstance: results[0].bookinstance,
    });
  });
};
