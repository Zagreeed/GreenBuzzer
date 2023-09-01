const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "cart must have a user"],
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "cart must have a product"],
  },
  quantity: Number,
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "productId",
    select: "name photo price priceDiscount classification",
  });

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
