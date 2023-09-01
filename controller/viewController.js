const catchAync = require("../utils/catchAync");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const appError = require("../utils/appError");
const { xPoweredBy } = require("helmet");

exports.getHome = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render("main-page", {
    title: "Main Page",
    products: products,
  });
};

exports.getAllVegetables = catchAync(async (req, res, next) => {
  const vegetables = await Product.find({ classification: "Vegetable" });

  res.status(200).render("vegetables-section", {
    Status: "Success",
    vegetables: vegetables,
  });
});

exports.getAllFruits = catchAync(async (req, res, next) => {
  const fruits = await Product.find({ classification: "Fruit" });

  res.status(200).render("fruits-section", {
    Status: "Success",
    fruits: fruits,
  });
});

exports.getSpecificProduct = catchAync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  console.log(product);

  // console.log(req.productId);
  // console.log(req.user.id);

  if (!product) {
    return next(new appError("This product is no longer available :<"));
  }

  res.status(200).render("product-detailt", {
    Status: "Success",
    product,
  });
});

exports.login = catchAync(async (req, res) => {
  res.status(200).render("login_page", {
    title: "Login",
    Status: "Success",
  });
});

exports.profile = catchAync(async (req, res) => {
  res.status(200).render("profile-page", {
    title: "Login",
    Status: "Success",
  });
});

// exports.profile = catchAync(async (req, res, next) => {
//   res.status(200).render("profile-page", {
//     title: profile,
//     Status: "Success",
//   });
// });

exports.showCart = catchAync(async (req, res) => {
  res.status(200).render("cart", {
    title: "Cart",
    Status: "Success",
  });
});
