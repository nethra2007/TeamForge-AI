const { formatErrorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Server Internal Error';
  const errorCode = err.code || 'SERVER_ERROR';

  res.status(statusCode).json(formatErrorResponse(message, errorCode, process.env.NODE_ENV === 'development' ? err.stack : null));
};

module.exports = errorHandler;
