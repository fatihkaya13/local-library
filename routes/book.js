const express = require('express');
const router = express.Router();

// Require our controllers.
const indexController = require('../controllers/books/index');
const listController = require('../controllers/books/list');
const createGetController = require('../controllers/books/create-get');
const createPostController = require('../controllers/books/create-post');
const deleteGetController = require('../controllers/books/delete-get');
const deletePostController = require('../controllers/books/delete-post');
const updateGetController = require('../controllers/books/update-get');
const updatePostController = require('../controllers/books/update-post');

// GET request for list of all Book.
router.get('/', listController);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/create', createGetController);

// POST request for creating Book.
router.post('/create', createPostController);

// GET request to delete Book.
router.get('/:id/delete', deleteGetController);

// POST request to delete Book.
router.post('/:id/delete', deletePostController);

// GET request to update Book.
router.get('/:id/update', updateGetController);

// POST request to update Book.
router.post('/:id/update', updatePostController);

// GET request for one Book.
router.get('/:id', indexController);

module.exports = router;
