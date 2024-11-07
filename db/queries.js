import db from './db.js';

const getUserId = async (email) => {
  const query = 'SELECT id FROM users WHERE email = ?';

  const userId = await new Promise((resolve, reject) => {
    db.query(query, [email], (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });

  return userId.length >= 1 ? userId[0].id : null;
};

async function accountExists(id) {
  return await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounts WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.length > 0);
    });
  });
}

async function deleteAccount(id) {
  return await new Promise((resolve, reject) => {
    const sql = 'DELETE FROM accounts WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return reject(err);
      }

      resolve(results?.affectedRows > 0);
    });
  });
}

async function getAccountByUserId(user_id) {
  return await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounts WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getAllUsers() {
  return await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getActiveUsers() {
  return await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE account_status_id = 1';
    db.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function updateUser(
  first_name,
  last_name,
  email,
  role_id,
  account_status_id,
  phone_number,
  city,
   zip_code,
  id,
) {
  const userTableUpdateQuery = `UPDATE users SET first_name = ?, last_name = ?, 
      email = ?, role_id = ?, account_status_id = ?, phone_number = ?
      WHERE id = ?`;

  return new Promise((resolve, reject) => {
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
      async (error, results) => {
        if (error) {
          return reject(error);
        }

        await updateUserAddress(city, zip_code, id);
        resolve(results);
      }
    );
  });
}


async function updateUserAddress(city, zip_code, id) {
  const userAddressTableUpdateQuery = `UPDATE user_address set city = ?, zip_code = ? where user_id = ?`;

  return new Promise((resolve, reject) => {
    db.query(
      userAddressTableUpdateQuery,
      [city, zip_code, id],
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );
  });
}

async function getTransactionHistory(id) {
  const query =
    'SELECT t.amount, tt.name, tf.fixed_fee, t.id FROM account_transactions at INNER JOIN transactions t ON at.transaction_id = t.id INNER JOIN transaction_fees tf ON t.transaction_fee_id = tf.id INNER JOIN transaction_types tt ON t.transaction_type_id = tt.id WHERE at.account_id = ?';

  return await new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function userExistsByEmail(email) {
  return await new Promise(async (resolve, reject) => {
    const results = await getUserByEmail(email);
    resolve(results.length > 0);
  });
}

export async function getUserByEmail(email) {
  return await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function insertUser(
  first_name,
  last_name,
  email,
  hashedPin,
  role_id,
  account_status_id,
  phone_number,
  city,
  zip_code
) {
  const userSql =
    'INSERT INTO users (first_name, last_name, email, pin, role_id, account_status_id, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)';

  return new Promise((resolve, reject) => {
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
      async (err, results) => {
        if (err) {
          return reject(err);
        }

        const user_id = results.insertId;
        await insertUserAddress(user_id, city, zip_code);
        resolve(user_id);
      }
    );
  });
}


export async function insertUserAddress(user_id, city, zip_code) {
  const addressSql =
    'Insert into user_address (user_id, city, zip_code) VALUES (?,?,?)';

  return new Promise((resolve, reject) => {
    db.query(addressSql, [user_id, city, zip_code], (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}

export default {
  getUserId,
  accountExists,
  deleteAccount,
  getAccountByUserId,
  getTransactionHistory,
  updateUser,
  getAllUsers,
  getActiveUsers,
  userExistsByEmail,
  getUserByEmail,
  insertUser,
};
