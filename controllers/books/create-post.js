// const Book = require("../../models/Book");
const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {

  /*
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: req.body.genre,
  });
*/
  // create instance of clickhouse
  const ch = createClickhouseClient();
  const { title, author, summary, isbn, genre } = req.body;

  // execute the following query
  ch.query(
    `INSERT INTO locallibrary.book
    VALUES (generateUUIDv4(), '${title}', '${author}', '${summary}', '${isbn}', '${genre}')`,
    (err, result) => {
      if (err) return next(err);
      console.log(result);
    }
  );

  res.redirect("/books");

  // '/books/'+id

  /*
  book.save(function (err) {
    if (err) return next(err);

    res.redirect(book.url);
  });
  */
};
