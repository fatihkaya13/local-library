const Book = require("../../models/Book");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {

  // create instance of click house 
  const ch = createClickhouseClient();
  const query = `select b.id as book_id, b.title, a.id as _id, a.first_name, a.family_name, a.date_of_birth, a.date_of_death
                  from locallibrary.book as b
                  join locallibrary.author as a
                  on locallibrary.author.id = locallibrary.book.author_id
                  order by b.title`;
  // execute the query
  ch.querying(query, (err, result) => {
    if (err) return next(err);
  }).then((queryResponse) => {
    let bookQueryArrObj = queryResponse.data;

    bookQueryArrObj = queryResponse.data.map(
      ([book_id, title, _id, first_name, family_name, date_of_birth, date_of_death]) => {
        return {
          book_id,
          url: '/books/'+book_id,
          title,
          author: {
            _id,
            first_name,
            family_name,
            date_of_birth,
            date_of_death,
          },
        };
      }
    );
    //console.log(bookQueryArrObj);

    res.render("book_list", { title: "Book List", book_list: bookQueryArrObj });
  });

  /*
  Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec(function (err, listBooks) {
      if (err) return next(err);

      console.log(listBooks);

      res.render("book_list", { title: "Book List", book_list: listBooks });
    });
    */
};
