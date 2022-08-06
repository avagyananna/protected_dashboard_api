
/* Module dependencies */

const { connBase } = require("../mongo/connections/mongo");
const {
    tokenSchema,
    userSchema
} = require("./schemas/mongooseSchemas");
const { COLLECTIONS } = require("./constants");

const UsersModel = connBase.model(COLLECTIONS.USERS.name, userSchema, COLLECTIONS.USERS.collection);
const TokenModel = connBase.model(COLLECTIONS.TOKEN.name, tokenSchema, COLLECTIONS.TOKEN.collection);


module.exports = {

    UsersModel,
    TokenModel
};
