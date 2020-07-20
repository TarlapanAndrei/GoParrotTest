const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const AppError = require('./authors-books/utils/appError');

const authorRouter = require('./authors-books/routes/authorRoute');
const bookRouter = require('./authors-books/routes/bookRoutes');
const globalErrorHandler = require('./authors-books/controlers/errorController');

const app = express();

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(compression());
app.use('/api/v1/authors', authorRouter);
app.use('/api/v1/books', bookRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `the ${req.originalUrl} is not a valid url on this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
