const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateDB = (err) => {
  const keys = Object.keys(err.keyValue);
  let message = 'Duplcate error';
  if (keys[0] === 'title' && keys[1] === 'author') {
    message = `Title '${err.keyValue.title}' is allready created on this author`;
  }
  if (keys[0] === 'name' && keys[1] === 'lastName' && keys[2] === 'birthday') {
    message = `Author with name '${err.keyValue.name}', last name '${
      err.keyValue.lastName
    }' and birthday '${err.keyValue.birthday.toLocaleString('en-us', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}' allredy exist`;
  }
  return new AppError(message, 403);
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error('Error', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    error.msg = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDB(error);
    sendErrorProd(error, res);
  }
};
