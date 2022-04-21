const { parallel } = require("async");

const BookInstance = require("../../models/BookInstance");
const Book = require("../../models/Book");
const async = require("async");

const { body, validationResult } = require("express-validator");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  // Validate and sanitize fields.

  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape();
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 3 })
    .escape();
  body("status").escape();
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate();

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  /*
  // Create a BookInstance object with escaped and trimmed data.
  const bookinstance = new BookInstance({
    book: req.body.book,
    imprint: req.body.imprint,
    status: req.body.status,
    due_back: req.body.due_back,
  });
  */

  const { book, imprint, status, due_back } = req.body;
  const ch = createClickhouseClient();

  if (!errors.isEmpty()) {
    ch.querying(`select * from locallibrary.book`, (err, result) => {
      if (err) return next(err);
    }).then((queryResponse) => {
      let bookInstanceQueryArr = queryResponse.data;
      let books = bookInstanceQueryArr.map(([_id, title]) => {
        return {
          _id,
          title,
        };
      });
      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: books,
        selected_book: book,
        errors: errors.array(),
        bookinstance: req.body,
      });
    });
    /*
    // There are errors. Render form again with sanitized values and error messages.
    Book.find({}, "title").exec(function (err, books) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: books,
        selected_book: bookinstance.book._id,
        errors: errors.array(),
        bookinstance: bookinstance,
      });
    });
    */
  } else {
    // Data from form is valid

    // execute the following query
    ch.query(
      `INSERT INTO locallibrary.book_instance
    VALUES (generateUUIDv4(), '${book}', '${status}', '${imprint}', '${due_back}')`,
      (err, result) => {
        if (err) return next(err);
      }
    );
    // Successful - redirect to new record.
    res.redirect("/book-instances");
    /*
    bookinstance.save(function (err) {
      if (err) {
        return next(err);
      }

      // Successful - redirect to new record.
      res.redirect(bookinstance.url);
    });
    */
  }
};
