const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV !== "production";

  // Normalize message
  let message = err.message;

  // If message is JSON string (from validation), parse it
  try {
    const parsed = JSON.parse(err.message);
    message = parsed;
  } catch {
    // keep original message
  }

  // If message is already an array/object, keep it
  if (Array.isArray(err.message)) {
    message = err.message;
  }

  // Known (operational) errors
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      status: err.status,
      message,
      ...(isDev && { stack: err.stack }),
    });
  }

  // Unknown errors (programming or unexpected)
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong",
    ...(isDev && { stack: err.stack }),
  });
};

export default errorHandler;