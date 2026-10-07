/**
 * Global Express Error Handling Middleware
 * Ensures internal errors or stack traces are not exposed to users.
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.isPublic ? err.message : 'An unexpected internal server error occurred.';

  return res.status(statusCode).json({
    success: false,
    error: message
  });
}

module.exports = errorHandler;
