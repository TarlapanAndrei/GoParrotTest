const httpMocks = require('node-mocks-http');
const {
  addAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../../authors-books/controlers/authorController');
const { createOne } = require('../../authors-books/controlers/handlerFactory');
const Author = require('../../authors-books/models/authorModel');
const testAuthor = require('../mock-data/author.json');
const allAuthors = require('../mock-data/allAuthor.json');
const AppError = require('../../authors-books/utils/appError');
const catchAsync = require('../../authors-books/utils/catchAsync');

jest.mock('../../authors-books/models/authorModel');

let req;
let res;
let next;
const authorId = '5f1085a7dcf6893eb8695ae2';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe('deleteAuthor', () => {
  it('should have a deleteAuthor function', () => {
    expect(typeof deleteAuthor).toBe('function');
  });
  it('should call Author.findByIdAdDelete', async () => {
    req.params.id = authorId;
    await deleteAuthor(req, res, next);
    expect(Author.findByIdAndDelete).toBeCalledWith(req.params.id);
  });
  it('should return statusCode 200 ', async () => {
    req.params.id = authorId;
    Author.findByIdAndDelete.mockReturnValue(testAuthor);
    await deleteAuthor(req, res, next);
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
describe('updateAuthor', () => {
  it('should have a updateAuthor function', () => {
    expect(typeof updateAuthor).toBe('function');
  });
  it('should update with Author.findByIdAndUpdate', async () => {
    req.params.id = authorId;
    req.body = testAuthor;
    await updateAuthor(req, res, next);
    expect(Author.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.id = authorId;
    req.body = testAuthor;
    Author.findByIdAndUpdate.mockReturnValue(testAuthor);
    await updateAuthor(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData().data.updatedDoc).toStrictEqual(testAuthor);
  });
  it('should return 404 when item doesnt exist', async () => {
    message = 'no document found with this ID';
    statusCode = 404;
    Author.findByIdAndUpdate.mockReturnValue(null);
    await updateAuthor(req, res, next);
    expect(next).toBeCalledWith(new AppError(message, statusCode));
    expect(res._isEndCalled).toBeTruthy();
  });
});
describe('should have getAllAuthors function', () => {
  it('should have a getAllAuthors function', () => {
    expect(typeof getAllAuthors).toBe('function');
  });
  it('should call Author.find({})', async () => {
    await getAllAuthors(req, res, next);
    expect(Author.find).toHaveBeenCalled();
  });
  it('should return response with statusCode 200 and all authors', async () => {
    Author.find.mockReturnValue(allAuthors);
    await getAllAuthors(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData().data.allDocs).toStrictEqual(allAuthors);
  });
});
describe('authorController.addAuthor', () => {
  beforeEach(() => {
    req.body = testAuthor;
  });
  it('should have an addAuthor function', () => {
    expect(typeof addAuthor).toBe('function');
  });
  it('should call Author.create', () => {
    addAuthor(req, res, next);
    expect(Author.create).toBeCalledWith(req.body);
  });
  it('should return 201 response code', async () => {
    await addAuthor(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled).toBeTruthy();
  });
  it('should return json body in response', async () => {
    Author.create.mockReturnValue(testAuthor);
    await addAuthor(req, res, next);
    expect(res._getJSONData().data.document).toStrictEqual(testAuthor);
  });
});
describe('authorController.getAuthor', () => {
  it('should have a getAuthor', () => {
    expect(typeof getAuthor).toBe('function');
  });
  it('should call Author.findById with route parameters', async () => {
    req.params.id = authorId;
    await getAuthor(req, res, next);
    expect(Author.findById).toBeCalledWith('5f1085a7dcf6893eb8695ae2');
  });
  it('should return json body and resp code 200', async () => {
    Author.findById.mockReturnValue(testAuthor);
    await getAuthor(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().data.document).toStrictEqual(testAuthor);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return 404 when item doesnt exist', async () => {
    message = 'No document with this id';
    statusCode = 404;
    Author.findById.mockReturnValue(null);
    await getAuthor(req, res, next);
    expect(next).toBeCalledWith(new AppError(message, statusCode));
    expect(res._isEndCalled).toBeTruthy();
  });
});
