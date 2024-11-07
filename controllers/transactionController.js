import queries from '../db/queries.js';

export const getTransactionHistory = async (req, res) => {
  const { email } = req.user;
  const id = await queries.getUserId(email);
  try{
    const accountTransactionInfo = await queries.getTransactionHistory(id); 

    res.status(200).json(accountTransactionInfo);
  }catch(e){
    res.status(500).send('Internal server error');
  }  
}
