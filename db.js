// db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Export the pool/db for use in other files
module.exports = db;
