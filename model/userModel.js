const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      unique: true,
    },
    email: {
      type: String,
      required: [
        true,
        "A user must have a email for login and verification purposes",
      ],
      unique: true,
      validate: [validator.isEmail, "Pleas  provide a valid email"],
    },
    photo: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Pleas provide a password for Authentication purposes"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please provide a confirmation password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password doesn't match",
      },
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

user.virtual("cart", {
  ref: "Cart",
  foreignField: "userId",
  localField: "_id",
});

user.pre(/^find/, function (next) {
  this.populate({
    path: "cart",
  });

  next();
});

user.methods.changedPasswordAfter = function (jwtIAT) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return jwtIAT < changedTimeStamp;
  }

  return false;
};

user.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 8);
  this.passwordConfirm = undefined;
  next();
});

user.methods.isSamePassword = async function (currentPassword, sysPassword) {
  return await bcrypt.compare(currentPassword, sysPassword);
};

const User = mongoose.model("User", user);

module.exports = User;
