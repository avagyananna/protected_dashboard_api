const jwt = require("jsonwebtoken");
const { UnauthorizedException } = require("../../error/exceptions");
const Token  = require("../../data-layer/mongo/queries/token")
const auth = {
    userAuth: async (req, res, next) => {
        let bearer = "";
        try {
            const obj = decodeToken(req.headers.authorization);
            bearer = obj.bearer;
            delete obj.bearer;
            const token = await Token.findOne({userId : obj.userId});
            if(!token){
                return next(new UnauthorizedException("invalid token"));
            }
            req.user = obj;
            next();
        } catch (error) {
            return next(new UnauthorizedException("Unauthorized: No authorization header"));
        }

    }
};

function decodeToken (auth) {
    const token = auth.split(" ");
    const decoded = jwt.verify(token[1], process.env.JWT_SECRET);
    return {
        bearer: token[1],
        ...decoded
    };
}

module.exports = auth;
