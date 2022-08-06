const Schema = require("mongoose").Schema;

const user = {
    userId: { type: String, required: true },
    email : { type : String, required : true},
    password : { type : String, required: true},

};

const schema = new Schema(user, {
    minimize: false,
    versionKey: false
});


module.exports = schema;
