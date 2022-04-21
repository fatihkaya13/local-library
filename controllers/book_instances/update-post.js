const { parallel } = require("async");

const BookInstance = require('../../models/BookInstance');
const Book = require('../../models/Book');
const async = require('async');

const { body, validationResult } = require('express-validator');

const { createClickhouseClient } = require("../../loaders/clickhouse.js");

module.exports = function (req, res, next) {
    
};
