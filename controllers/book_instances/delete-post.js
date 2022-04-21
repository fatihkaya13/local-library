const { parallel } = require("async");

const BookInstance = require("../../models/BookInstance");
const Book = require("../../models/Book");
const async = require("async");

const { body, validationResult } = require("express-validator");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  const bookInstanceId = req.body.id;
  const query = `ALTER TABLE locallibrary.book_instance DELETE WHERE id = '${bookInstanceId}'`;

  ch = createClickhouseClient();
  ch.query(query, (err, result) => {
    if (err) return next(err);
    res.redirect("/book-instances");
  });
  // Success, so redirect to list of BookInstance items.
  // res.redirect("/bookinstances");
  /*
  // Assume valid BookInstance id in field.
  BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
    if (err) {
      return next(err);
    }
    // Success, so redirect to list of BookInstance items.
    res.redirect("/bookinstances");
  });
  */
};
