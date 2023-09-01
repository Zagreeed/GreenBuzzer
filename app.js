const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./controller/errorController");
const express = require("express");
const app = express();

const viewRouter = require("./router/viewRouter");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const cartRouter = require("./router/cartRouter");

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet({ contentSecurityPolicy: false }));

console.log(process.env.NODE_ENV);

app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
});

/// ROUTES
app.use("/", viewRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cart", cartRouter);

app.use(errorHandler);

module.exports = app;
