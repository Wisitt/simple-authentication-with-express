const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createPool, generateToken } = require("../utils");

const pool = createPool();

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const [results] = await conn.query(
      "SELECT password FROM users WHERE email = ?",
      email
    );
    conn.release();

    const [user] = results;

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateToken(email, "5s");
    const refreshToken = generateToken(email, "30d");

    res
      .status(200)
      .json({ message: "Login successfully", accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const conn = await pool.getConnection();
    await conn.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);
    conn.release();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = generateToken(decoded.email, "15m");
    const newRefreshToken = generateToken(decoded.email, "30d");
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { login, register, refreshToken };
