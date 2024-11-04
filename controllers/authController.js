import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { account_status_util } from "../utils/account_status_util.js";
import queries from '../db/queries.js';

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
    const userExist = await queries.userExistsByEmail(email); 

    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    // creating the hash for the pin
    const hashedPin = await bcrypt.hash(pin, 10);

    // me insertu te dhenat ne tablen e userit
    const user_id = await queries.insertUser(first_name, last_name, email, hashedPin, role_id, account_status_id, phone_number, city, zip_code);
    const token = jwt.sign(
      {
        id: user_id,
        email: email,
        role_id: role_id,
        account_status_id: account_status_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    res.json({ token, isAdmin: role_id === 1 });
  } catch (error) {
    console.log('in here')
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, pin } = req.body;

  if (!email || !pin) {
    return res.status(400).json({ error: "Invalid email or pin" });
  }

  try{
    const results = await queries.getUserByEmail(email);

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
  }catch(e){
    console.log(e);
    return res.status(500).json({ error: "Internal server error" });
  } 
};


const isUserActive = (res, user) => {
  if (user?.account_status_id) {
    return account_status_util(res, user.account_status_id);
  }
};
