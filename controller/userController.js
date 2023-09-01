const User = require("../model/userModel");
const catchAync = require("../utils/catchAync");

exports.creatUser = async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    photo: req.body.photo,
  });

  res.status(201).json({
    Status: "Success",
    data: user,
  });
};

exports.getAllUser = async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    Status: "Success",
    result: user.length,
    data: user,
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getSpecificUser = catchAync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("cart");

  res.status(200).json({
    Status: "Success",
    data: user,
  });
});
