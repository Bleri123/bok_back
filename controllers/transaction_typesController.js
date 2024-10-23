import db from "../db.js";
export const getAlltransaction_types = (req, res) => {
  const sql = "SELECT * FROM transaction_types";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};
