export const sendSuccess = (res, message, data = {}, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

export const sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  error = null
) =>
  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.toString() : undefined,
  });
