
class DefaultException extends Error {
    constructor (...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DefaultException);
        }
        if (params[0] instanceof ExceptionMessage) {
            this.exceptionMessage = params[0];
        }
        this.date = new Date();
    }
}

class ServiceUnavailableException extends DefaultException {
    constructor (
        message = "Server Unavailable Error",
        status = 503,
        ...params) {
        super(message, status, ...params);
        this.exception = "ServiceUnavailable";
    }
}

class UnauthorizedException extends DefaultException {}
class BadInputException extends DefaultException {}
class ServerInternalException extends DefaultException {}
class ForbiddenException extends DefaultException {}
class NotFoundException extends DefaultException {}
class BadRequestException extends DefaultException {}
class ConflictException extends DefaultException {}

module.exports = {
    DefaultException,
    BadInputException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    ServerInternalException,
    ServiceUnavailableException,
    BadRequestException,
    ConflictException
};
