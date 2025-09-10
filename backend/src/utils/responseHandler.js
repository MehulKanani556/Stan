// Utility functions for standardized API responses

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} [data] - Optional data to send
 * @param {number} [statusCode] - HTTP status code (default: 200)
 * @returns {Object} Express response
 */
export const sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        ...(data && { data })
    });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} [errors] - Optional additional error details
 * @returns {Object} Express response
 */
export const sendErrorResponse = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        ...(errors && { errors })
    });
};

/**
 * Send a bad request response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Object} [errors] - Optional additional error details
 * @returns {Object} Express response
 */
export const sendBadRequestResponse = (res, message, errors = null) => {
    return sendErrorResponse(res, 400, message, errors);
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export const sendNotFoundResponse = (res, message) => {
    return sendErrorResponse(res, 404, message);
};

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export const sendUnauthorizedResponse = (res, message) => {
    return sendErrorResponse(res, 401, message);
};

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export const sendForbiddenResponse = (res, message) => {
    return sendErrorResponse(res, 403, message);
};

/**
 * Send an internal server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Object} [errors] - Optional additional error details
 * @returns {Object} Express response
 */
export const sendInternalServerErrorResponse = (res, message, errors = null) => {
    return sendErrorResponse(res, 500, message, errors);
};
