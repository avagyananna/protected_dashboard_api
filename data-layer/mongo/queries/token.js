const { TokenModel } = require("../defaults");

const Token = {
    find: async (query, credentials = null) => {
        return await TokenModel.find(query, credentials, { lean: true });
    },
    findOne: async (query, credentials = null) => {
        return await TokenModel.findOne(query, credentials, { lean: true });
    },
    create: async (data) => {
        return await await TokenModel.create(data);
    },
    update: async (userId, data) => {
        await TokenModel.update({ userId }, { $set: data }, {upsert: true});
    }

};

module.exports = Token;
