const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const createPool = () => {
  return mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

const generateToken = (email, expiresIn) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

module.exports = { createPool, generateToken };
