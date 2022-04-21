const { parallel } = require("async");

const BookInstance = require("../../models/BookInstance");
const Book = require("../../models/Book");
const async = require("async");

const { body, validationResult } = require("express-validator");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  const ch = createClickhouseClient();
  const query = `select * from locallibrary.book`;

  ch.querying(query, (err, result) => {
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
    });
  });

  /*
  BookInstance.find()
    .populate("book")
    .exec(function (err, list_bookinstances) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: list_bookinstances,
      });
    });
    */
};
