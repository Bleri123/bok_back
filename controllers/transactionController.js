import db from '../db.js';
import { getUserId } from '../models/user.js';

export const getTransactionHistory = async (req, res) => {
  const { email } = req.user;
  const id = await getUserId(email);

  try{
    const accountTransactionInfo = await new Promise((resolve, reject) => {
      db.query(
        'SELECT amount, role FROM account_transactions at INNER JOIN transactions t ON at.transaction_id = t.id WHERE at.account_id = ?',
        [id],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });

    res.status(200).json(accountTransactionInfo);
  }catch(e){
    res.status(500).send('Internal server error');
  }
  
}
