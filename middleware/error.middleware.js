const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  // Known (operational) errors
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Unknown errors (programming or unexpected)
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong",
  });
};

export default errorHandler;