const { BadRequestException } = require("../../error/exceptions");

module.exports = function queryValidation (req, res, next) {
    if (req.query && req.query.q && typeof req.query.q !== "string") {
        throw new BadRequestException(`Invalid query parameter q: ${typeof req.query.q === "object" ? JSON.stringify(req.query.q) : req.query.q}`);
    }
    next();
};
