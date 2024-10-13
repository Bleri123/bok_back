const db = require("../db");

// Get all users
exports.getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching students:", err.message);
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};

exports.getActiveUsers = (req, res) => {
  const sql = "SELECT * FROM users WHERE account_status_id = 1";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching students:", err.message);
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};

