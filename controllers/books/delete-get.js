const { parallel } = require("async");

const Book = require("../../models/Book");
const BookInstance = require("../../models/BookInstance");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  const bookId = req.params.id;
  const ch = createClickhouseClient();
  let results = {};

  const query = `
  select b.id as book_id, b.title as title, b.isbn, b.summary, a.id as _id, 
         a.first_name as first_name, a.family_name as family_name, 
         a.date_of_birth as date_of_birth, a.date_of_death as date_of_death, 
         g.name as name, i.id as instance_id, i.status as status, i.imprint as imprint, i.due_back as due_back
  from locallibrary.book as b
  join locallibrary.author as a
  on locallibrary.author.id = locallibrary.book.author_id
  left join locallibrary.genre as g
  on locallibrary.genre.book_id = locallibrary.book.id
  left join locallibrary.book_instance i
  on locallibrary.book.id = locallibrary.book_instance.book_id
  where b.id = '${bookId}'`;

  ch.querying(query, (err, result) => {
    if (err) return next(err);
  }).then((queryResponse) => {
    let queryArray = queryResponse.data;

    bookInstancesQueryArrObj = queryArray.map(
      ([book, , , , , , , , , , _id, status, imprint, due_back]) => {
        return {
          book,
          _id,
          status,
          imprint,
          due_back,
        };
      }
    );
    results.book_instances = bookInstancesQueryArrObj;
    // left join bugfix
    if (results.book_instances[0].status === '') {
      results.book_instances = [];
    }

    results.book = {
      genre: [queryArray[0][9]], // test
      _id: queryArray[0][0],
      title: queryArray[0][1],
      isbn: queryArray[0][2],
      summary: queryArray[0][3],
      // delete_url: `${queryArray[0][0]}/delete`,
      author: {
        _id: queryArray[0][4],
        first_name: queryArray[0][5],
        family_name: queryArray[0][6],
        date_of_birth: queryArray[0][7],
        date_of_death: queryArray[0][8],
      },
    };
    // console.log("results", results)
    if (results.book == null) return res.redirect("/books");


    res.render("book_delete", {
      title: "Delete Book",
      book: results.book,
      book_instances: results.book_instances,
    });
  });
  /*
  parallel(
    {
      book: function (callback) {
        Book
          .findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback);
      },
      bookInstances: function (callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      }
    },
    function (err, results) {
      if (err) return next(err);
      if (results.book == null) return res.redirect('/books');

      res.render('book_delete', {
        title: 'Delete Book',
        book: results.book,
        book_instances: results.bookInstances
      });
    }
  );
  */
};
