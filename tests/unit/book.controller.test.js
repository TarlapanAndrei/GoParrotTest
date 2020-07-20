const httpMocks = require('node-mocks-http');
const {
  createBook,
  getAllBooks,
  getBook,
  deleteBook,
  updateBook,
} = require('../../authors-books/controlers/bookController');
const Book = require('../../authors-books/models/bookModel');
const testBook = require('../mock-data/book.json');
const allBook = require('../mock-data/allBooks.json');
const AppError = require('../../authors-books/utils/appError');

jest.mock('../../authors-books/models/bookModel');

let req;
let res;
let next;
const bookId = '5f1085a7dcf6893eb8695ae2';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe('deleteBook', () => {
  it('should have a deleteAuthor function', () => {
    expect(typeof deleteBook).toBe('function');
  });
  it('should call Book.findByIdAdDelete', async () => {
    req.params.id = bookId;
    await deleteBook(req, res, next);
    expect(Book.findByIdAndDelete).toBeCalledWith(req.params.id);
  });
  it('should return statusCode 200 ', async () => {
    req.params.id = bookId;
    Book.findByIdAndDelete.mockReturnValue(testBook);
    await deleteBook(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  // it('should handle errors', async () => {
  //   const errorMessage = { message: 'Error deleting'};
  //   const rejectedPromise = Promise.reject(errorMessage);
  //   Author.findByIdAndDelete.mockReturnValue(rejectedPromise);
  //   await deleteAuthor((req, res, next) => {
  //     expect(next).toHaveBeenCalledWith(errorMessage);
  //   });
  // });
});
describe('updateBook', () => {
  it('should have a updateBook function', () => {
    expect(typeof updateBook).toBe('function');
  });
  it('should update with Book.findByIdAndUpdate', async () => {
    req.params.id = bookId;
    req.body = testBook;
    await updateBook(req, res, next);
    expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.id = bookId;
    req.body = testBook;
    Book.findByIdAndUpdate.mockReturnValue(testBook);
    await updateBook(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData().data.updatedDoc).toStrictEqual(testBook);
  });
  it('should return 404 when item doesnt exist', async () => {
    message = 'no document found with this ID';
    statusCode = 404;
    Book.findByIdAndUpdate.mockReturnValue(null);
    await updateBook(req, res, next);
    expect(next).toBeCalledWith(new AppError(message, statusCode));
    expect(res._isEndCalled).toBeTruthy();
  });
});
describe('should have getAllBooks function', () => {
  it('should have a getAllBooks function', () => {
    expect(typeof getAllBooks).toBe('function');
  });
  it('should call Book.find({})', async () => {
    await getAllBooks(req, res, next);
    expect(Book.find).toHaveBeenCalled();
  });
  it('should return response with statusCode 200 and all authors', async () => {
    Book.find.mockReturnValue(allBook);
    await getAllBooks(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
});
describe('bookController.createBook', () => {
  beforeEach(() => {
    req.body = testBook;
  });
  it('should have an createBook function', () => {
    expect(typeof createBook).toBe('function');
  });
  it('should call Book.create', () => {
    createBook(req, res, next);
    expect(Book.create).toBeCalledWith(req.body);
  });
  it('should return 201 response code', async () => {
    await createBook(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled).toBeTruthy();
  });
  it('should return json body in response', async () => {
    Book.create.mockReturnValue(testBook);
    await createBook(req, res, next);
    expect(res._getJSONData().data.document).toStrictEqual(testBook);
  });
});
describe('bookController.getBook', () => {
  it('should have a getBook', () => {
    expect(typeof getBook).toBe('function');
  });
  it('should call Book.findById with route parameters', async () => {
    req.params.id = bookId;
    await getBook(req, res, next);
    expect(Book.findById).toBeCalledWith('5f1085a7dcf6893eb8695ae2');
  });
  it('should return json body and resp code 200', async () => {
    Book.findById.mockReturnValue(testBook);
    await getBook(req, res, next);
    expect(res.statusCode).toBe(200);
  });
});
