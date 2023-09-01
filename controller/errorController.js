// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      stack: err.stack,
      error: err,
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    console.log("wala pa na himo ang error handling sa Production :<>");
  }

  next();
};
