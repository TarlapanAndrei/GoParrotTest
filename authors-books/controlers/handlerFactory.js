const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError('no document found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    req.body.updatedAt = Date.now();
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(new AppError('no document found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        updatedDoc,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        document: newDocument,
      },
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;
    if (!document) {
      return next(new AppError('No document with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });
exports.getAll = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.authorId) filter = { author: req.params.authorId };
    let docs = Model.find(filter);
    if (populateOptions) docs = docs.populate(populateOptions);
    const allDocs = await docs;
    res.status(200).json({
      status: 'success',
      results: allDocs.length,
      data: {
        allDocs,
      },
    });
  });
