
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

class ExceptionMessage {
    constructor (title, message) {
        this.title = title;
        this.message = message;
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

class WithMessageException extends DefaultException {
    constructor (
        message = "Something went wrong",
        status = 403,
        ...params) {
        super(message, status, ...params);
        this.exception = "WithMessageException";
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
    ExceptionMessage,
    ServiceUnavailableException,
    WithMessageException,
    BadRequestException,
    ConflictException
};
