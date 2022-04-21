const { parallel } = require("async");

const Book = require("../../models/Book");
const Author = require("../../models/Author");
const Genre = require("../../models/Genre");
const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
  const query = ` select b.id as book_id, b.title as title, b.isbn, b.summary, a.id as _id, 
  a.first_name as first_name, a.family_name as family_name, 
  a.date_of_birth as date_of_birth, a.date_of_death as date_of_death, 
  g.name as name, i.id as instance_id, i.status as status, i.imprint as imprint, i.due_back as due_back
from locallibrary.book as b
join locallibrary.author as a
on locallibrary.author.id = locallibrary.book.author_id
left join locallibrary.genre as g
on locallibrary.genre.book_id = locallibrary.book.id
left join locallibrary.book_instance i
on locallibrary.book.id = locallibrary.book_instance.book_id`;

  // TODOS: genre name is coming with null value

  ch = createClickhouseClient();
  const bookId = req.params.id;

  ch.querying(query, (err, result) => {
    if (err) return next(err);
  }).then((queryResponse) => {
    let results = queryResponse.data;
    results = results.map(
      ([
        book_id,
        title,
        isbn,
        summary,
        author_id,
        first_name,
        family_name,
        date_of_birth,
        date_of_death,
        genre_name,
        instance_id,
        status,
        imprint,
        due_back,
      ]) => {
        return {
          authors: [
            {
              _id: author_id,
              first_name,
              family_name,
              date_of_birth,
              date_of_death,
            },
          ],
          genres: [{ name: "Drama" }], //test
          book: {
            genre: [{ genre_name }],
            _id: book_id,
            title,
            summary,
            isbn,
            author: {
              _id: author_id,
              first_name,
              family_name,
              date_of_birth,
              date_of_death,
            },
          },
        };
      }
    );

    res.render("book_form", {
      title: "Update Book",
      authors: results[0].authors,
      genres: results[0].genres,
      book: results[0].book,
    });
  });
  /*
  parallel({
    book: function (callback) {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
    },
    authors: function (callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    }
  }, function (err, results) {
    if (err) return next(err);
    if (results.book == null) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    // Mark our selected genres as checked.
    for (let genreIter = 0; genreIter < results.genres.length; genreIter++) {
      for (let bookGenreIter = 0; bookGenreIter < results.book.genre.length; bookGenreIter++) {
        if (results.genres[genreIter]._id.toString() === results.book.genre[bookGenreIter]._id.toString()) {
          results.genres[genreIter].checked = 'true';
        }
      }
    }
    res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
  });
  */
};
