
class AppError extends Error {
    constructor(message, statusCocde) {
        super(message)
        this.statusCode = statusCocde;
        this.status = `${statusCocde}`.startsWith('4') ? 'Failed' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError