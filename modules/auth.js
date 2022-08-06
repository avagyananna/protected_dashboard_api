const { BadRequestException, BadInputException, ConflictException } = require("../error");
const User  = require("../data-layer/mongo/queries/user");
const Token = require("../data-layer/mongo/queries/token");
const jwt = require("jsonwebtoken");
const uuid = require("uuid")
const crypto = require("crypto");
async function createUser(req, res, next){
    const body = req.body;

    if(body.userId || body.password){
        throw new BadRequestException("invalid body")
    }

    const user = await User.findOne({userId: body.userId});

    if(user){
        throw new ConflictException();
    }

    const userId = uuid()
   
    const encryptedPassword =  crypto.createHash("md5").update(body.password).digest("hex");

    const data  = {
        userId,
        email : body.email,
        password : encryptedPassword
    }

    const bearer = jwt.sign({
        userId,
        email: body.email,
        iat: moment().unix()
    }, process.env.JWT_SECRET);

     await User.create(data)

     await Token.create({
        userId,
        email : data.email,
        bearer
     });

     return {
        userId,
        email,
        bearer
      }
}

async function deleteUser(req, res, next){
    const body = req.body;

    if(body.userId || body.password){
        throw new BadRequestException("invalid body")
    }
  
    const encryptedPassword =  crypto.createHash("md5").update(body.password).digest("hex");

    const user = await User.findOne({userId, password : encryptedPassword});

    if(!user){
        throw new BadRequestException("invalid user")
    }

    await User.findOneAndDelete({userId : user.userId, password: encryptedPassword});

    await Token.findOneAndDelete({userId : user.userId});

    return {};

}

async function login(req, res, next){

    const body = req.body;

    if(!body.email || !body.password) {
        throw new BadRequestException("invalid body")
    }

    const encryptedPassword =  crypto.createHash("md5").update(body.password).digest("hex");
    const user = await User.findOne({email: body.email, password : encryptedPassword});

    if(!user){
        throw new BadInputException("invalid email or password")
    }

    const bearer = jwt.sign({
        userId: user.userId,
        email: body.email,
        iat: moment().unix()
    }, process.env.JWT_SECRET);

    await Token.update(user.userId, {bearer} );

    return {
        ...user,
        bearer
    }

}

async function logout(req,res){
    const body = req.body;
    if(body.userId || body.password){
        throw new BadRequestException("invalid body")
    }

    const userId = body.userId;
    await Token.findOneAndDelete({userId: req.user.userId});
    return {}

}

module.exports = {
    createUser,
    deleteUser,
    login,
    logout
}