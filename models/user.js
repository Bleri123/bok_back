import db from '../db.js';

export const getUserId = async (email) => {
  const query = 'SELECT id FROM users WHERE email = ?';

  const userId = await new Promise((resolve, reject) => {
    db.query(query, [email], (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });

  return userId.length >= 1 ? userId[0].id : null;
};
