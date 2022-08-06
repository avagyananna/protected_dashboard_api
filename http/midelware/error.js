
const winston = require("winston");
const {
    DefaultException,
    NotFoundException,
    BadInputException,
    ForbiddenException,
    UnauthorizedException,
    ServerInternalException,
    ExceptionMessage
} = require("../../error");

module.exports = async function errorMiddleware (err, req, res, next) {
    const error = typeof err !== "object"
        ? new ServerInternalException(String(err))
        : (err instanceof DefaultException ? err : new ServerInternalException(err));

    let status = 500;
    if (error instanceof UnauthorizedException) status = 401;
    else if (error instanceof BadInputException) status = 400;
    else if (error instanceof ServerInternalException) status = 500;
    else if (error instanceof ForbiddenException) status = 403;
    else if (error instanceof NotFoundException) status = 404;

    /* Log Output */
    if (status >= 500) {
        winston.log("error", `${req.originalUrl} ${error.stack}`);
    }

    if (error.exceptionMessage instanceof ExceptionMessage) {
        return res.status(status).json({ error: error.exceptionMessage });
    }

    res.status(status).json({ message: error.message });
};
