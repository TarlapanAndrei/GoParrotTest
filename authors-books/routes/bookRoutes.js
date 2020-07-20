const express = require('express');
const {
  createBook,
  getAllBooks,
  deleteBook,
  updateBook,
  setAuthorId,
  getBook,
} = require('../controlers/bookController');

const router = express.Router({ mergeParams: true });

router.route('/').post(setAuthorId, createBook).get(getAllBooks);

router.route('/:id').get(getBook).delete(deleteBook).patch(updateBook);

module.exports = router;
