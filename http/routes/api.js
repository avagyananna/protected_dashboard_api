
const router = require("express").Router();
const { expressWrapper } = require("../helper");

// toDo logic dashboard page
router.get("/", expressWrapper(async (req,res, next)=>{
    return "Hello World"
}))

module.exports = router;
