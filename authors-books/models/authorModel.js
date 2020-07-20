const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please introduce the name'],
    maxlength: [40, 'A name must have less or equal then 40 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please introduce the last name'],
    maxlength: [40, 'A last name must have less or equal then 40 characters'],
  },
  birthday: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

authorSchema.index({ name: 1, lastName: 1, birthday: 1 }, { unique: true });

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
