const AppError = require("../utils/AppError");

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map(err => err.message);
  const message =  `Invalid input data. ${errors.join(". ")} `;
  return new AppError(message, 400);
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleJWTError = (err) => new AppError('Invalid token, Please login again', 401)
const handleJWTExpiredError = (err) => new AppError('Token expired, Please login again', 401)
const handleDuplicateFieldsDB = (err) => new AppError(`Dublicate key ${err.keyValue.email}`, 401)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
      err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err
    if (error.name === 'ValidationError') error = handleValidatorErrorDB(error);
    // if (error.name === 'CastError') error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // res.status(error.statusCode).json({
    //   status: error.status,
    //   message: error.message,
    //   error1: error,
    //   error,
    // })
    sendErrorProd(error, res)
  }
};
