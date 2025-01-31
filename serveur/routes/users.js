// /routes/users.js
var express = require('express');
var router = express.Router();
const { login } = require('../controllers/connexionController');


// Route POST pour la connexion
router.post('/login', login);

module.exports = router;
