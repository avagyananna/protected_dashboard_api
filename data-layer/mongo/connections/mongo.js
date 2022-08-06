
const mongoose = require("mongoose");
const { $set } = require("../../../variables");
const { DB } = require("../constants");
const logger = require("../../../logger");

mongoose.Promise = Promise;
const connections = {};

const statuses = {};
const isConnectionsEstablished = () =>
    statuses[DB.DB1] 

const changeConnectionStatus = (name, status = true) => {
    const connectionsStatusBeforeChanges = isConnectionsEstablished();
    // eslint-disable-next-line security/detect-object-injection
    statuses[name] = status;
    const connectionsStatusAfterChanges = isConnectionsEstablished();
    if (connectionsStatusAfterChanges === connectionsStatusBeforeChanges) return;
    $set("MongodbConnectionsStatus", connectionsStatusAfterChanges ? "connected" : "disconnected");
};

const createConfiguration = (name) => {
    const url = process.env[`MONGO_${name}_HOST`];
    const options = {
        // autoIndex: process.env.NODE_ENV === "DEVELOPMENT",
        useNewUrlParser: process.env[`MONGO_${name}_USE_NEW_URL_PARSER`] || true,
        autoReconnect: process.env[`MONGO_${name}_AUTO_RECONNECT`] || false,
        bufferMaxEntries: parseInt(process.env[`MONGO_${name}_BUFFER_MAX_ENTRIES`] || 0),
        bufferCommands: process.env[`MONGO_${name}_BUFFER_COMMAND`] || false,
        connectTimeoutMS: parseInt(process.env[`MONGO_${name}_CONNECTION_TIMEOUT_MS`] || 20000),
        poolSize: parseInt(process.env[`MONGO_${name}_POOL_SIZE`] || 50),
        useUnifiedTopology: true
    };
    if (process.env[`MONGO_${name}_REPLICA_SET`]) {
        options.replicaSet = process.env[`MONGO_${name}_REPLICA_SET`];
        options.readPreference = process.env[`MONGO_${name}_READ_PREFERENCE`] || "secondaryPreferred";
    }
    return { url, options };
};

const createConnection = (name) => {
    const { url, options } = createConfiguration(name);
    // eslint-disable-next-line security/detect-object-injection
    connections[name] = mongoose.createConnection(url, options);
    // eslint-disable-next-line security/detect-object-injection
    connections[name].on("disconnected", (e) => {
        changeConnectionStatus(name, false);
        logger.error("Reconnecting to " + url);
        setTimeout(() => { createConnection(name); }, 5000);
    });
    // eslint-disable-next-line security/detect-object-injection
    connections[name].on("error", (e) => {
        logger.error(e);
    });
    // eslint-disable-next-line security/detect-object-injection
    connections[name].on("open", () => {
        changeConnectionStatus(name, true);
        logger.info(`Connected to MongoDB ${name} ` + url);
    });
    // eslint-disable-next-line security/detect-object-injection
    return connections[name];
};

/*
* DB Main Configuration
* */
const db1Configuration = createConfiguration(DB.DB1);
mongoose.connect(db1Configuration.url);
mongoose.connection.on("disconnected", (e) => {
    changeConnectionStatus(DB.DB1, false);
    logger.error("Reconnecting to " + db1Configuration.url);
    setTimeout(() => {
        mongoose.connect(db1Configuration.url, db1Configuration.options);
    }, 5000);
});
mongoose.connection.on("open", (e) => {
    changeConnectionStatus("DB1", true);
    logger.info("Connected to MongoDB DB1 " + db1Configuration.url);
});

mongoose.connection.on("error", (err) => {
    logger.error(err);
});

// IMPORTANT check functional after mongoose version updates
const __setOptions = mongoose.Query.prototype.setOptions;
mongoose.Query.prototype.setOptions = function (options, overwrite) {
    this.options.maxTimeMS = 20000;
    __setOptions.apply(this, arguments);
    return this;
};
/*
* Other Connections
* */
const connBase = mongoose.connection;

module.exports = {
    connBase
};
