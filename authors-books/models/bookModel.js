const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book title is required'],
    maxlength: [60, 'A title must have less or equal then 40 characters'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'Author',
    required: [true, 'The book must belong to an author'],
  },
  iban: {
    type: String,
    validate: [validator.isIBAN, 'IBAN mast only contain valid IBAN'],
    required: [true, 'IBAN is required'],
  },
  publisheAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

bookSchema.index({ title: 1, author: -1 }, { unique: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
