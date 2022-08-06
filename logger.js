
const winston = require("winston");
const { format } = winston;

const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.simple()
    ),
    transports: [
        new winston.transports.Console()
        // new winston.transports.File({ filename: "logfile.log" })
    ]
});

module.exports = logger;
