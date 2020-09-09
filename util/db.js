const mysql = require('mysql2')
const config = require('config')

const password = config.get('mysqlPassword')

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    database: 'stock_app',
    password,
    timezone: 'utc'
})


module.exports = pool.promise()