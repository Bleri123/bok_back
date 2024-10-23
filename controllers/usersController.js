import db from "../db.js";

// Get all users
export const getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};

export const getActiveUsers = (req, res) => {
  const sql = "SELECT * FROM users WHERE account_status_id = 1";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};

export const updateUserByID = async (req, res) => {
  const { id } = req.params;

  const {
    first_name,
    last_name,
    email,
    role_id,
    account_status_id,
    phone_number,
    city,
    zip_code,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !role_id ||
    !account_status_id ||
    !phone_number ||
    !city ||
    !zip_code
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userExist = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE id = ?";
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        }

        resolve(results);
      });
    });

    if (userExist?.length == 0) {
      return res
        .status(400)
        .json({ error: `User with this id: ${id} not found` });
    }

    const userTableUpdateQuery = `UPDATE users SET first_name = ?, last_name = ?, 
      email = ?, role_id = ?, account_status_id = ?, phone_number = ?
      WHERE id = ?`;

    db.query(
      userTableUpdateQuery,
      [
        first_name,
        last_name,
        email,
        role_id,
        account_status_id,
        phone_number,
        id,
      ],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Database query error" });
        }

        const userAddressTableUpdateQuery = `UPDATE user_address set city = ?, zip_code = ? where user_id = ?`;

        db.query(userAddressTableUpdateQuery, [city, zip_code, id], (e, r) => {
          if (e) {
            return res.status(500).json({ error: "Database query error" });
          }

          res.status(200).json({
            message: "User update successfully",
            status: "success",
            data: [],
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
