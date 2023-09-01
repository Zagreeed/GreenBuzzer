const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");
const authController = require("../controller/authController");

router.get("/", authController.isLogIn, viewController.getHome);

router.get(
  "/vegetables",
  authController.isLogIn,
  viewController.getAllVegetables
);
router.get("/fruits", authController.isLogIn, viewController.getAllFruits);
router.get(
  "/product/:slug",
  authController.isLogIn,
  viewController.getSpecificProduct
);

router.get("/loginnn", authController.isLogIn, viewController.login);

router.get("/profile", authController.isLogIn, viewController.profile);
router.get(
  "/showCart",
  authController.protection,
  authController.isLogIn,
  viewController.showCart
);

module.exports = router;
