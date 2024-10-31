import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { account_status_util } from "../utils/account_status_util.js";

export const register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    pin,
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
    !pin ||
    !role_id ||
    !account_status_id ||
    !phone_number ||
    !city ||
    !zip_code
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // check if user with this email exits
    // select * from users where email = "Almedin.nasufi@gmail.com" 0.5s
    const userExist = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE email = ?";
      db.query(sql, [email], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results.length > 0);
      });
    }); //0.5s

    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    // creating the hash for the pin
    const hashedPin = await bcrypt.hash(pin, 10);

    // me insertu te dhenat ne tablen e userit

    const userSql =
      "INSERT INTO users (first_name, last_name, email, pin, role_id, account_status_id, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(
      userSql,
      [
        first_name,
        last_name,
        email,
        hashedPin,
        role_id,
        account_status_id,
        phone_number,
      ],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: "Database error during user insert" });
        }

        // me insertu te dhenat ne tablen e user address.
        const user_id = results.insertId;

        const addressSql =
          "Insert into user_address (user_id, city, zip_code) VALUES (?,?,?)";
        db.query(
          addressSql,
          [user_id, city, zip_code],
          (address_err, address_results) => {
            if (address_err) {
              res
                .status(500)
                .json({ error: "Database error during user address insert" });
            }

            res.status(201).json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = (req, res) => {
  const { email, pin } = req.body;

  if (!email || !pin) {
    return res.status(400).json({ error: "Invalid email or pin" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length == 0) {
      return res.status(400).json({ error: "Invalid email or pin" });
    }

    const user = results[0];
    const isActive = isUserActive(res, user);
    if (isActive) {
      const isMatch = await bcrypt.compare(pin, user.pin);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or pin" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role_id: user.role_id,
          account_status_id: user.account_status_id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.json({ token, isAdmin: user.role_id === 1 });
    }
  });
};

const isUserActive = (res, user) => {
  if (user?.account_status_id) {
    return account_status_util(res, user.account_status_id);
  }
};
