const Book = require("../../models/Book");
const {
  createClickhouseClient,
} = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: req.body.genre,
  });


  const ch = createClickhouseClient();

  // test connection and insert to another db
  ch.query(
    `INSERT INTO 
      VALUES ('customer6', '2021-06-10', 'add_to_cart', 'US', 66666 )`,
    (err, data) => {
      if (err) {
        console.log(err);
        return next(err);
      } else console.log("values are inserted");
    }
  );

  book.save(function (err) {
    if (err) return next(err);

    res.redirect(book.url);
  });
};
