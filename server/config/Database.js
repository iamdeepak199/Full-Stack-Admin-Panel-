const mysql = require("mysql2");
const dotenv = require("dotenv");
const chalk = require("chalk");
dotenv.config();

const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log(chalk.white.bgGreen(`Connected to MySQL DataBase : ${db.config.database}`));

});

module.exports = db;
