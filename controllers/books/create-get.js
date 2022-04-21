const { parallel } = require("async");

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

// const Author = require("../../models/Author");
// const Genre = require("../../models/Genre");

module.exports = function (req, res, next) {
  const ch = createClickhouseClient();

  const authorQuery = `select * from locallibrary.author`;
  const genresQuery = `select * from locallibrary.genre`;

  let results = { authors: [], genres: [] };

  // genre query may be empyt with parallel execution TODOS::
  parallel(
    ch
      .querying(genresQuery, (err, result) => {
        if (err) return next(err);
      })
      .then((res) => {
        let genresQueryArrObj = res.data;
        genresQueryArrObj = res.data.map(([_id, name]) => {
          return {
            _id,
            name,
          };
        });
        results.genres = genresQueryArrObj;
      }),
    ch
      .querying(authorQuery, (err, result) => {
        if (err) return next(err);
      })
      .then((queryResponse) => {
        let authorQueryArrObj = queryResponse.data;

        // convert nested array to array of objects
        authorQueryArrObj = queryResponse.data.map(
          ([_id, first_name, family_name, date_of_birth, date_of_death]) => {
            return {
              _id,
              first_name,
              family_name,
              date_of_birth,
              date_of_death,
            };
          }
        );
        results.authors = authorQueryArrObj;

        // console.log(results);

        res.render("book_form", {
          title: "Create Book",
          authors: results.authors,
          genres: results.genres,
        });
      })
  );

  /*
  parallel(
    {
      authors: function (callback) {
        Author.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
      });

    }
  );
  */
};
