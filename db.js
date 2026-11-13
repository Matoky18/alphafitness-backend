require("dotenv").config();

const {Pool} = require("pg");



const pool = new Pool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port : process.env.DB_PORT
})

module.exports = pool;



// pool.query("SELECT NOW()")
// .then(res => {
//     console.log("Database connected successfully", res.rows);
// }).catch(error=> {
//     console.log("Database connection failed", error);
// })