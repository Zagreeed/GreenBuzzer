const express = require("express");
const router = express.Router({ mergeParams: true });
const cartController = require("../controller/cartController");
const authController = require("../controller/authController");

router.use(authController.protection);

router.route("/").get(cartController.getAllCart);

router
  .route("/addtocart")
  .post(cartController.addIdToCart, cartController.addToCart);
module.exports = router;

router.route("/delete").delete(cartController.deleteCart);
