require("dotenv").config();

const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbPort = process.env.DB_PORT

module.exports = {
    "dbHost": dbHost,
    "dbName": dbName,
    "dbUser": dbUser,
    "dbPass": dbPass,
    "dbPort": dbPort   
}
