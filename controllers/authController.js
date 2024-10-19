import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
          console.error("error saving the user", err.message);
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
              console.error(
                "error saving the user address",
                address_err.message
              );
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
    console.error("Error registering the user:", error.message);
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
      console.error("error fetching user:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length == 0) {
      return res.status(400).json({ error: "Invalid email or pin" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or pin" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({ token });
  });
};