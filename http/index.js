
const app = require("express")();
const OS = require("os");

require("../data-layer/mongo/connections/mongo") 

const bodyParser = require("body-parser");

const errorMiddleware = require("./midelware/error");

const logger = require("../logger");
const { $set, $get } = require("../variables");
require("dns");
require("dnscache")({
    enable: true,
    ttl: 600,
    cachesize: 50000
});
const {userAuth} = require("./midelware/auth")
const auth  = require("./routes/auth");
const queryValidation = require("./midelware/queryValidation");

/* Express middleware */
app.use(bodyParser.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }));
app.use(bodyParser.text({ type: "application/x-www-form-urlencoded", limit: "6mb" }));
app.use(bodyParser.raw({ type: "image/*", limit: "6mb" }));
app.use(bodyParser.json({
    type: function (v) {
        if (v.headers["content-type"]) {
            if (v.headers["content-type"].match(/multipart\/form-data/)) {
                return false;
            }
        }
        return true;
    },
    limit: "6mb"
}));

app.use(queryValidation);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, HEAD");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        const requestAllowHeaders = req.headers["access-control-request-headers"]
            ? req.headers["access-control-request-headers"]
                .split(",").map(item => item.trim())
            : [];
        requestAllowHeaders.push("Content-Type");
        res.setHeader("Access-Control-Allow-Headers", requestAllowHeaders.join(","));
        return res.send();
    }
    next();
});

app.use("/api", userAuth);

app.use("/auth", auth);

/* Production Error Handler */

app.use(errorMiddleware);

/*
* App Connection
* */
const connect = (app, cb) =>
    (
        $get("MongodbConnectionsStatus") === "connected"
    )
        ? cb(app.listen(
            process.env.SERVER_PORT,
            function () {
                $set("ReadinessCheck", true);
                $set("OSHostName", OS.hostname());

                app.emit("appStarted");
                logger.info("Node.js server is running on " +
                    `${process.env.SERVER_PORT} port, ` +
                    `with ${process.env.NODE_ENV} mode, using process id ${process.pid}`
                );
            }
        ))
        : setTimeout(() => {
            logger.info("Node.js server is trying to establish");
            logger.info("MongodbConnectionsStatus: " + $get("MongodbConnectionsStatus"));
            logger.info("GlobalSettings: " + $get("GlobalSettings"));
            connect(app, cb);
        }, 2000);

let service = null;
connect(app, (res) => (service = res));

const onTerminate = (name) => (err, promise) => {
    console.log(`ProcessEnded ${name}`);
    if (err && err instanceof Error) {
        console.log(err.message, err.stack);
        console.log(promise);
    } else {
        console.log(err);
    }
    process.exit(1);
};

const onGracefulShutdown = (name) => (err, promise) => {
    $set("ReadinessCheck", false);
    console.log(`ProcessTriggered ${name}`);
    if (service) {
        setTimeout(() => {
            service.close(() => {
                onTerminate(name)(err, promise);
            });
        }, 6000);
    }
};

// process.on("uncaughtException", onTerminate("Unexpected Error"));
process.on("unhandledRejection", onTerminate("Unhandled Promise"));

process.on("SIGTERM", onGracefulShutdown("SIGTERM"));
process.on("SIGINT", onGracefulShutdown("SIGINT"));

module.exports = app;
