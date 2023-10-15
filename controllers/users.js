const { createPool } = require("../utils");

const pool = createPool();

const getAllUsers = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    const [results] = await conn.query("SELECT * FROM users");
    conn.release();
    res.status(200).json({
      users: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
};
