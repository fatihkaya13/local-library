const { parallel } = require("async");

const BookInstance = require("../../models/BookInstance");
const Book = require("../../models/Book");
const async = require("async");

const { body, validationResult } = require("express-validator");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  // create instance of click house

  const ch = createClickhouseClient();

  const bookInstanceId = req.params.id;

  const query = `select i.id as _id, i.book_id, i.status, i.imprint, i.due_back,
 b.title, b.author_id, b.summary, b.isbn, b.genre_id
 from locallibrary.book as b
 join locallibrary.book_instance as i
 on b.id = i.book_id
 and i.id ='${bookInstanceId}'`;

  ch.querying(query, (err, result) => {
    if (err) return next(err);
  }).then((queryResponse) => {
    let bookinstance = queryResponse.data;
    // console.log(bookinstance)

    // no need for array mapping, just create an object !! TODOS
    bookinstance = queryResponse.data.map(
      ([
        _id,
        book_id,
        status,
        imprint,
        due_back,
        title,
        author_id,
        summary,
        isbn,
        genre_id,
      ]) => {
        return {
          _id,
          status,
          imprint,
          due_back,
          book: {
            // genre is a possible bug
            // genre comes with an array when execute on mongo query, may need to change!!!
            genre_id,
            book_id,
            title,
            author_id,
            summary,
            isbn,
          },
        };
      }
    );

    if (bookinstance == null) {
      // No results.
      var err = new Error("Book copy not found");
      err.status = 404;
      return next(err);
    }
    res.render("bookinstance_detail", {
      title: "Book:",
      bookinstance: bookinstance[0],
    });
  });

  /*
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function (err, bookinstance) {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        // No results.
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_detail", {
        title: "Book:",
        bookinstance: bookinstance,
      });
    });

    */
};
