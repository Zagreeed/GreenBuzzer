const express = require("express");
const productController = require("../controller/productController");
const router = express.Router();
const authController = require("../controller/authController");
const cartRouter = require("../router/cartRouter");

router.use("/:productId/product", cartRouter);

router
  .route("/")
  .post(productController.creatProduct)
  .get(productController.getAllProduct);

router.use(authController.protection);

router
  .route("/:id")
  .patch(authController.restricTo("admin"), productController.patchProduct)
  .get(productController.getSpecificProduct)
  .delete(productController.deleteProduct);

module.exports = router;
