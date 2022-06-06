var express = require("express");
const { login, register } = require("../controller/authcontroller");

var router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
