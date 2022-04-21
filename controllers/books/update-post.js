const Book = require("../../models/Book");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  ch = createClickhouseClient();
  const bookId = req.params.id;

  console.log(req.body)
  const { title, author, status, summary, isbn, genre } = req.body;

  const updateStatement = `ALTER TABLE locallibrary.book
   UPDATE title = '${title}', summary = '${summary}', isbn = '${isbn}', author_id = '${author}'
   WHERE id = '${bookId}'`;

  ch.query(updateStatement, (err, result) => {
    if (err) return next(err);
  });

  res.redirect("/books");

  /*
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
    _id: req.params.id,
  });
  Book.findByIdAndUpdate(req.params.id, book, {}, function (err, bookRes) {
    if (err) return next(err);

    res.redirect(bookRes.url);
  });

  */
};
