const slugify = require("slugify");
const mongoose = require("mongoose");

const product = mongoose.Schema({
  name: {
    type: String,
  },
  productDetail: String,
  shortMessage: String,
  photo: String,
  slug: String,
  price: {
    type: Number,
  },
  classification: {
    type: String,
    enum: ["Vegetable", "Fruit"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "The Discount price is greater than the original price",
    },
  },
});

const Product = mongoose.model("Product", product);

module.exports = Product;
