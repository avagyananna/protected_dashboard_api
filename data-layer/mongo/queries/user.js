const { UsersModel } = require("../defaults");

const User = {
    find: async (query, credentials = null) => {
        return await UsersModel.find(query, credentials, { lean: true });
    },
    findOne: async (query, credentials = null) => {
        return await UsersModel.findOne(query, credentials, { lean: true });
    },
    create: async (data) => {
        return await await UsersModel.create(data);
    },
    update: async (userId, data) => {
        await UsersModel.update({ userId }, { $set: data });
    },
    findOneAndDelete: async (query)=> {
        await UsersModel.findOneAndDelete(query)
    }

};

module.exports = User;
