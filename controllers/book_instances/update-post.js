const { parallel } = require("async");

const BookInstance = require("../../models/BookInstance");
const Book = require("../../models/Book");
const async = require("async");

const { body, validationResult } = require("express-validator");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  ch = createClickhouseClient();
  const bookInstanceId = req.params.id;

  const { book, imprint, status, due_back } = req.body;

  const query = `select b.*, i.*
      from locallibrary.book b
      left join locallibrary.book_instance i
      on b.id = i.book_id
      where i.id = '${bookInstanceId}'
      `;

  const updateStatement = `ALTER TABLE locallibrary.book_instance 
   UPDATE imprint = '${imprint}', status = '${status}', due_back = '${due_back}'
   WHERE id = '${bookInstanceId}'`;

  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate();

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // There are errors so render the form again, passing sanitized values and errors.
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

      res.render("bookinstance_form", {
        title: "Update BookInstance",
        book_list: results.books,
        selected_book: results.bookinstance.book._id,
        errors: errors.array(),
        bookinstance: req.body,
      });
    });
  } else {
    // Data from form is valid.

    ch.query(updateStatement, (err, result) => {
      if (err) return next(err);
    });

    res.redirect("/book-instances");
    /*
    BookInstance.findByIdAndUpdate(
      req.params.id,
      bookinstance,
      {},
      function (err, thebookinstance) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to detail page.
        res.redirect(thebookinstance.url);
      }
    );*/
  }
};
