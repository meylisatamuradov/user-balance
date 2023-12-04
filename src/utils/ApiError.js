const DEFAULT_ERRORS = {
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "Not found",
  },
  VALIDATION: {
    code: "VALIDATION",
    message: "Validation error",
  },
};

/**
 * @class BaseError
 * @param {number} statusCode - HTTP status code
 * @param {boolean} isOperational - Is this error operational
 * @param {string} message - Error message
 * @param {string} type - Error type
 */
class BaseError extends Error {
  constructor(message, statusCode, type, isOperational) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

/**
 * @class ApiError
 */
class ApiError extends BaseError {
  constructor(message, statusCode, type) {
    super(message, statusCode, type, true);
  }
}
/**
 * Check if error is an api specific error
 * @param {Error} err - Error object
 * @returns {boolean} - Is this error an ApiError
 */
export const IsApiError = (err) =>
  err instanceof ApiError ? err.isOperational : false;

export class NotFoundError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.NOT_FOUND.message,
    type = DEFAULT_ERRORS.NOT_FOUND.code
  ) {
    super(message, 404, type);
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.VALIDATION.message,
    type = DEFAULT_ERRORS.VALIDATION.code
  ) {
    super(message, 400, type);
  }
}
