import db from '../db.js';

export const fetchAccount = () => {
  // qitu ka me punu talati
  //   talat
};

export const deleteAccount = async (req, res) => {
  const id = req.params.id;

  try {
    async function accountExists() {
      return await new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM accounts WHERE id = ?';
        db.query(sql, [id], (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results.length > 0);
        });
      });
    }

    const exists = await accountExists();
    if(!exists){
      return res.status(400).json({ error: 'Account does not exist' });
    }

    async function deleteAccount(){
      return await new Promise((resolve, reject) => {
        const sql = 'DELETE FROM accounts WHERE id = ?';
        db.query(sql, [id], (err, results) => {
          if (err) {
            reject(err);
          }
         
          resolve(results?.affectedRows > 0);
        });
      });
    }

    const deleteAcc = await deleteAccount();

    // couldn't be deleted successfuly
    if (!deleteAcc) {
      res.status(500).json('Account could not be deleted');
    }

    res.status(200).json('Account deleted')
  } catch (error) {
    res.status(500).json('Internal server error');
  }
};
