import db from "../db.js";
export const fetchAccount = (req,res) => {
  const sql = "SELECT * FROM accounts";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};
