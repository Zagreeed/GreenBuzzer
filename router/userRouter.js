const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/login").post(authController.login);
router.get("/logOut", authController.logOut);
router.route("/signup").post(authController.signUp);

//////////////////////////////////////////// IS NOW PROTECTED
router.use(authController.protection);

router.route("/").get(userController.getAllUser);

router.patch("/updateMyPassword", authController.changePassword);
router.patch("/updateMe", authController.updateSettings);

router.route("/me").get(userController.getMe, userController.getSpecificUser);

router.route("/:id").get(userController.getSpecificUser);

module.exports = router;
