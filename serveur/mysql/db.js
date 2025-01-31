const mysql = require("mysql2/promise")
require('dotenv').config();

const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'Admin_07!',
    database: 'gestiondechet'
    //
})

module.exports = db