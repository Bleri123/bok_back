import db from '../db.js';
import { getUserId } from '../models/user.js';

export const getTransactionHistory = async (req, res) => {
  const { email } = req.user;
  const id = await getUserId(email);
  const query =
    'SELECT t.amount, at.role, tf.fixed_fee FROM account_transactions at INNER JOIN transactions t ON at.transaction_id = t.id INNER JOIN transaction_fees tf ON t.transaction_fee_id = tf.id WHERE at.account_id = ?'; 

  try{
    const accountTransactionInfo = await new Promise((resolve, reject) => {
      db.query(
        query,
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
