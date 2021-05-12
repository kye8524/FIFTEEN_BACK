const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: '52.79.196.94',
    port: 3306,
    user: 'fifteen',
    password: 'fifteen',
    database: 'fifteen',
    connectionLimit: 10
})

module.exports = pool