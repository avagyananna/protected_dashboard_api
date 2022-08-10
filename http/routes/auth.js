const router = require("express").Router();
const { expressWrapper } = require("../helper");
const { createUser , deleteUser, login} = require("../../modules/auth")

router.get("/login", async function(req, res){
    res.render("login.hbs")
})
router.get("/register", async function(req, res){
    res.render("register.hbs")
})


router.post("/register", expressWrapper(createUser))

router.delete("/delete", expressWrapper(deleteUser))

router.post("/login", expressWrapper(login))



module.exports = router