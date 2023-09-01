const Cart = require("../model/cartModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAync");
const Product = require("../model/productModel");

exports.addIdToCart = catchAsync(async (req, res, next) => {
  if (!req.body.userId) req.body.userId = req.user.id;

  next();
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const addCart = await Cart.create(req.body);

  res.status(200).json({
    Status: "Success",
    data: {
      data: addCart,
    },
  });
});

exports.getAllCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find().populate("productId");

  res.status(200).json({
    Status: "Success",
    data: {
      length: cart.length,
      data: cart,
    },
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndRemove(req.body);
  if (!cart) {
    return next(new appError("This cart does not exist", 404));
  }
  res.status(204).json({
    Status: "Success",
    data: null,
  });
});
