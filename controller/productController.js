const Product = require("../model/productModel");
const catchAsync = require("../utils/catchAync");
const APIFeatures = require("../utils/apiFeatures");
const appError = require("../utils/appError");

exports.creatProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    Status: "Success",
    data: {
      data: product,
    },
  });
};

exports.getAllProduct = async (req, res) => {
  const product = new APIFeatures(Product.find(), req.query).filter().sorting();

  const item = await product.query;

  res.status(201).json({
    Status: "Success",
    totalProduct: item.length,
    data: {
      item,
    },
  });
};

exports.patchProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new appError("There is no product with that ID!", 404));
  }

  res.status(200).json({
    Status: "Success",
    data: {
      data: product,
    },
  });
});

exports.getSpecificProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new appError("No Product found with that ID", 404));
  }

  res.status(200).json({
    Status: "Success",
    data: {
      data: product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product) {
    return next(new appError("Id not Found pls check if the id is correct"));
  }
  res.status(204).json({
    Status: "Success",
    data: null,
  });
});
