const logger = require("../logger");
function setExpired (res, time) {
    res.setHeader("Cache-Control", `public, max-age=${time}`);
    res.setHeader("Expires", new Date(Date.now() + (time * 1000)).toUTCString());
}

module.exports = {
    expressWrapper (cb) {
        return async (req, res, next) => {
            try {
                const data = await cb(req, res, next);
                res.json({ status: "OK", result: data || {} });
            } catch (err) {
                next(err);
            }
        };
    }
};
