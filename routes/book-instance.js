const express = require("express");
const router = express.Router();

// Require our controllers.
const indexController = require("../controllers/book_instances/index");
const listController = require("../controllers/book_instances/list");
const createGetController = require("../controllers/book_instances/create-get");
const createPostController = require("../controllers/book_instances/create-post");
const deleteGetController = require("../controllers/book_instances/delete-get");
const deletePostController = require("../controllers/book_instances/delete-post");
const updateGetController = require("../controllers/book_instances/update-get");
const updatePostController = require("../controllers/book_instances/update-post");

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
// router.get('/create', book_instance_controller.bookinstance_create_get);
router.get("/create", createGetController);

// POST request for creating BookInstance.
router.post("/create", createPostController);

// GET request to delete BookInstance.
router.get("/:id/delete", deleteGetController);

// POST request to delete BookInstance.
router.post("/:id/delete", deletePostController);

// GET request to update BookInstance.
router.get("/:id/update", updateGetController);

// POST request to update BookInstance.
router.post("/:id/update", updatePostController);

// GET request for one BookInstance.
router.get("/:id", indexController);

// GET request for list of all BookInstance.
router.get("/", listController);

module.exports = router;
