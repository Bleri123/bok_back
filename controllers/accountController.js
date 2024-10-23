import db from "../db.js";

export const fetchAccount = () => {

  // qitu ka me punu talati
  //   talat
};



export const getallaccount_types = (req, res) => {
  const sql = "SELECT * FROM account_types";
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};