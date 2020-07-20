const express = require('express');

const {
  getAllAuthors,
  getAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controlers/authorController');
const booksRouter = require('./bookRoutes');

const router = express.Router();

router.use('/:authorId/books', booksRouter);

router.route('/').get(getAllAuthors).post(addAuthor);

router.route('/:id').get(getAuthor).patch(updateAuthor).delete(deleteAuthor);

module.exports = router;
