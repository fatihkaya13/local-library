const BookInstance = require("../../models/BookInstance");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  // create instance of click house
  const ch = createClickhouseClient();
  const query = `select i.id as _id, i.book_id, i.status, i.imprint, i.due_back,
                b.title, b.author_id, b.summary, b.isbn, b.genre_id
                from locallibrary.book as b
                join locallibrary.book_instance as i
                on b.id = i.book_id`;
  // execute the query
  ch.querying(query, (err, result) => {
    if (err) return next(err);
  }).then((queryResponse) => {
    let list_bookinstances = queryResponse;

    list_bookinstances = queryResponse.data.map(
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

    // console.log(queryResponse);

    res.render("bookinstance_list", {
      title: "Book Instance List",
      bookinstance_list: list_bookinstances,
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
