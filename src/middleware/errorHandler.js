<<<<<<< HEAD
export const globalErrorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Development error response (more details)
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (err.isOperational) {
    // Production error response
    // Trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak details
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
=======
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  console.error(`[ERROR] ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    status,
    message: err.message,
    // The stack trace helps you find the bug, but only shows in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
>>>>>>> ffd27423d8bb249b747b98c98dcbb46e2d69da4c
};
