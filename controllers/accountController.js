import db from "../db.js";

export const fetchAccount = () => {
  // qitu ka me punu talati
  //   talat
};
export const fetchAccountByUserId = (req, res) => {
  const user_id = req.params.user_id
  const sql = "SELECT * FROM accounts WHERE user_id = ?";
  db.query(sql,[user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};