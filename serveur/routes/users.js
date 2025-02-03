var express = require("express");
var router = express.Router();
const { login } = require("../controllers/connexionController");

router.post("/login", login);

module.exports = router;
