const Author = require('../models/authorModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.getAllAuthors = getAll(Author);
exports.getAuthor = getOne(Author);
exports.addAuthor = createOne(Author);
exports.updateAuthor = updateOne(Author);
exports.deleteAuthor = deleteOne(Author);
