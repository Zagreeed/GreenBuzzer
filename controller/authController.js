const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAync");
const appError = require("../utils/appError");
const User = require("../model/userModel");

const singToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_STR, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const creatSendTokenn = (user, statusCode, res) => {
  const token = singToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

  res.cookie("jwt", token, cookiesOptions);

  user.password = undefined;

  res.status(statusCode).json({
    Status: "Success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    photo: req.body.photo,
  });

  creatSendTokenn(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // 1. get email and password
  // 2. check if email or password is doest not exist throw a error
  // 3. query the user using the email
  // 4. if the query find nothing throw an error
  // 5. give the token

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please provide email and password", 404));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.isSamePassword(password, user.password))) {
    return next(new appError("Incorrect email or password", 404));
  }

  creatSendTokenn(user, 200, res);
});

exports.protection = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new appError("You are not logged-in please log-in first"));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_STR
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new appError("This user doest not exist.", 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new appError("User recently changed the passowrd ", 401));
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();

  // 1. initialize the token var then check if req.headers.authorization exist and req.headers.authorization string starts with "Bearer"
  // 2. check if token doest not exist that means its not  logggedin
  // 3. check if the token is altered by someone / verify if its exprired
  // 4. query the user by id using the var ID of the checked token in step 3
  // 5. if user doet not exist throw an error
  // 6. check if user changed the passoword after the token is issued
  // 7. set the req.user = current user and res.locals.user = current user
});

exports.isLogIn = async (req, res, next) => {
  // if (req.cookies.jwt) {
  //   try {
  //     const decoded = await promisify(jwt.verify)(
  //       req.cookie.jwt,
  //       process.JWT_SECRET_STR
  //     );

  //     const user = await User.findById(decoded.id);
  //     console.log(user);
  //     if (!user) {
  //       return next();
  //     }

  //     if (user.changedPasswordAfter(decoded.ait)) {
  //       return next();
  //     }

  //     res.locals.user = user;

  //     return next();
  //   } catch (err) {
  //     return next();
  //   }
  // }
  // next();

  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_STR
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You don't have the permission to do this action")
      );
    }

    next();
  };
};

exports.logOut = (req, res) => {
  res.cookie("jwt", "logOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    Status: "Success",
  });
};

exports.changePassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.isSamePassword(req.body.currentPassword, user.password))) {
    return next(new appError("Password are not the same"));
  }

  user.password = req.body.NewPassword;
  user.passwordConfirm = req.body.passwordconfirm;

  await user.save();

  creatSendTokenn(user, 200, res);
});

exports.updateSettings = catchAsync(async (req, res) => {
  if (req.body.passwordconfirm || req.body.newpass) {
    return next(
      new appError(
        "This settings page is not for updating password pleas use the other settings page"
      )
    );
  }

  const filterBody = filterObj(req.body, "name", "email");
  console.log(filterBody);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    Status: "Success",
    data: {
      user: updatedUser,
    },
  });
});
