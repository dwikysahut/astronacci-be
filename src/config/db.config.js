const mysql = require("mysql2");
const bluebird = require("bluebird");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Raw MySQL connection with mysql2
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Raw MySQL database connected");
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: true,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to the database");
  } catch (error) {
    console.error("Unable to connect to the database via Sequelize:", error);
  }
})();

module.exports = { connection, sequelize };
