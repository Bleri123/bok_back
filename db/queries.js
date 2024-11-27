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
    const sql = `SELECT a.id as 'account_id', u.first_name, u.last_name, u.email,  a.account_number, a.balance,
        acs.name as "status_name", act.type, act.id as account_type_id  FROM accounts a
        inner join users u on u.id = a.user_id
              inner join account_status acs on acs.id = a.account_status_id
              inner join account_types act on act.id = a.account_type_id
        where user_id = ?`;
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
    const sql = `SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          r.name AS 'role_name',
          acs.name AS 'account_status',
          ua.city,
          ua.zip_code
      FROM
      users u
          INNER JOIN
      roles r ON u.role_id = r.id
          INNER JOIN
      account_status acs ON acs.id = u.account_status_id
          INNER JOIN
      user_address ua ON ua.user_id = u.id
      ORDER BY u.first_name, u.last_name;`;
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
  id
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
  const query = `
    SELECT 
        t.amount, tt.name, tf.fixed_fee, t.id
      FROM
        account_transactions at
          INNER JOIN
        transactions t ON at.transaction_id = t.id
          INNER JOIN
        transaction_fees tf ON t.transaction_fee_id = tf.id
          INNER JOIN
        transaction_types tt ON t.transaction_type_id = tt.id
          INNER JOIN
          accounts a ON a.id = at.account_id
        WHERE a.user_id = ?;
    `;

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
  phone_number,
  account_status_id,
  account_type_id,
  city,
  zip_code
) {
  const userSql =
    'INSERT INTO users (first_name, last_name, email, pin, role_id, phone_number, account_status_id) VALUES (?, ?, ?, ?, ?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.query(
      userSql,
      [
        first_name,
        last_name,
        email,
        hashedPin,
        role_id,
        phone_number,
        account_status_id,
      ],
      async (err, results) => {
        if (err) {
          return reject(err);
        }

        const user_id = results.insertId;
        await insertUserAddress(user_id, city, zip_code);
        await insertUserAccount(user_id, account_type_id);
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

export async function insertUserAccount(user_id, account_type_id) {
  const accountSql =
    'Insert into accounts(user_id, account_type_id) VALUES (?,?)';

  return new Promise((resolve, reject) => {
    db.query(accountSql, [user_id, account_type_id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export async function getAccountTransactionSinceDate(id, sinceDate) {
  const query =
    'SELECT t.amount, tt.name, tf.fixed_fee, t.id, at.created_at FROM account_transactions at INNER JOIN transactions t ON at.transaction_id = t.id INNER JOIN transaction_fees tf ON t.transaction_fee_id = tf.id INNER JOIN transaction_types tt ON t.transaction_type_id = tt.id WHERE at.account_id = ? AND at.created_at > ?';
  return await new Promise((resolve, reject) => {
    db.query(query, [id, sinceDate], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function checkIfUserHasDebitAccount(user_id) {
  return await new Promise((resolve, reject) => {
    const sql = `SELECT count(*) as count FROM account_types at LEFT JOIN accounts a ON at.id = a.account_type_id WHERE at.id = 1 AND a.user_id = ?;`;
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function getUserBalance(user_id, account_type_id) {
  return await new Promise((resolve, reject) => {
    const sql = `SELECT id, user_id, balance FROM accounts where account_type_id = ? and user_id = ?`;
    db.query(sql, [account_type_id, user_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function getTransactionFee(transaction_type_id) {
  return await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM transaction_fees where transaction_type_id = ?`;
    db.query(sql, [transaction_type_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function createNewTransaction(
  transaction_type_id,
  transaction_fee_id,
  amount,
  transaction_date = new Date().toISOString().slice(0, 19).replace('T', ' ')
) {
  return await new Promise((resolve, reject) => {
    const sql = `INSERT INTO transactions (transaction_type_id,transaction_fee_id,amount,transaction_date) VALUE (?,?,?,?) `;
    db.query(
      sql,
      [transaction_type_id, transaction_fee_id, amount, transaction_date],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
}

export async function reduceBalance(new_balance, user_id, account_type_id) {
  return await new Promise((resolve, reject) => {
    const sql = `UPDATE accounts set balance = ? where user_id = ? and account_type_id = ?`;
    db.query(sql, [new_balance, user_id, account_type_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function createAccountTransaction(
  account_id,
  transaction_id,
  role
) {
  return await new Promise((resolve, reject) => {
    const sql = `INSERT INTO account_transactions (account_id, transaction_id, role) VALUES (?,?,?)`;
    db.query(sql, [account_id, transaction_id, role], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function addBalanceToAccount(account_id, amount) {
  const query = 'UPDATE accounts SET balance = balance + ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [amount, account_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export async function getAccountInformation(user_id, account_id) {
  const query = `
    SELECT 
      a.id AS 'account_id',
      u.first_name, 
      u.last_name, 
      u.email,  
      a.account_number, 
      a.balance, 
      acs.name AS 'status_name', 
      act.type 
    FROM accounts a
      INNER JOIN users u ON u.id = a.user_id
      INNER JOIN account_status acs ON acs.id = a.account_status_id
      INNER JOIN account_types act ON act.id = a.account_type_id
    WHERE a.id = ? and u.id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [account_id, user_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

const getAccountTypes = async () => {
  const query = 'SELECT * FROM account_types';

  return await new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
};

const getUserAccountStatuses = async () => {
  const query = 'SELECT * FROM user_account_status';

  return await new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
};

const getUserRoles = async () => {
  const query = 'SELECT * FROM roles';

  return await new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
};

const getAllAccounts = async (userId) => {
  const query = `
    SELECT 
      a.account_number,
      aas.name AS status,
      at.type,
      a.balance,
      a.created_at
    FROM
      accounts a
          INNER JOIN
      account_status aas ON a.account_status_id = aas.id
          INNER JOIN
      account_types at ON a.account_type_id = at.id
    WHERE
      user_id = ?;
  `;

  return await new Promise((resolve, reject) => {
    db.query(query, [userId], (err, result) => {
      if(err){
        return reject(err);
      }

      resolve(result);
    });
  });
};

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
  getAccountTransactionSinceDate,
  checkIfUserHasDebitAccount,
  getUserBalance,
  getTransactionFee,
  createNewTransaction,
  reduceBalance,
  createAccountTransaction,
  addBalanceToAccount,
  getAccountInformation,
  getAccountTypes,
  getUserAccountStatuses,
  getUserRoles,
  getAllAccounts
};
