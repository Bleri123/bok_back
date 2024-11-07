import queries from '../db/queries.js';

export const deleteAccount = async (req, res) => {
  const id = req.params.id;

  try {
    const exists = await queries.accountExists(id);
    if(!exists){
      return res.status(400).json({ error: 'Account does not exist' });
    }    

    const deleteAcc = await queries.deleteAccount(id);

    // couldn't be deleted successfuly
    if (!deleteAcc) {
      res.status(500).json('Account could not be deleted');
    }

    res.status(200).json('Account deleted')
  } catch (error) {
    res.status(500).json('Internal server error');
  }
};

export const fetchAccount = async (req,res) => {
  const user_id = req.user.id;
  try{
    const account = await queries.getAccountByUserId(user_id);
    res.send(account);
  }catch(e){
    res.status(500).json('Internal server error');
  }
};

export const fetchAccountByUserId = async (req, res) => {
  const user_id = req.params.user_id
  try{
    const result = await queries.getAccountByUserId(user_id);
    res.send(result);
  }catch(e){
    res.status(500).json('Internal server error');
  }
};

