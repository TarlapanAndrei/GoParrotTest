const Book = require('../models/bookModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.setAuthorId = (req, res, next) => {
  if (!req.body.author) req.body.author = req.params.authorId;
  next();
};
exports.createBook = createOne(Book);
exports.getAllBooks = getAll(Book, {
  path: 'author',
  select: '-_id -createdAt -birthday -__v',
});
exports.getBook = getOne(Book, {
  path: 'author',
  select: '-_id -createdAt -birthday -__v',
});
exports.deleteBook = deleteOne(Book);
exports.updateBook = updateOne(Book);
