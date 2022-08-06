const router = require("express").Router();
const { expressWrapper } = require("../helper");
const { createUser , deleteUser, login, logout} = require("../../modules/auth")

router.post("/register", expressWrapper(createUser))

router.delete("/delete", expressWrapper(deleteUser))

router.post("/login", expressWrapper(login))

router.post("/logout", expressWrapper(logout))


module.exports = router