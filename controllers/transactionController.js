import queries from "../db/queries.js";

export const getTransactionHistory = async (req, res) => {
  const { email } = req.user;
  const id = await queries.getUserId(email);
  try {
    const accountTransactionInfo = await queries.getTransactionHistory(id);

    res.status(200).json(accountTransactionInfo);
  } catch (e) {
    res.status(500).send("Internal server error");
  }
};

export const deposit = async (req, res) => {
  const { amount, account_id } = req.body;
  if (amount > 500) {
    res.status(400).send("You cannot deposit values higher than 500");
    return;
  }
  try {
    await queries.addBalanceToAccount(account_id, amount);
  } catch (e) {
    res.status(500).send("Internal server error");
  }

  res.send("Successfuly deposited");
};

export const sendMoney = async (req, res) => {
  const { id } = req.user;
  const { amount, sender_account_number, receiver_account_number } = req.body;
  try {
    await queries.sendMoney(
      id,
      amount,
      sender_account_number,
      receiver_account_number
    );
    res.status(200).json({ message: "Transaction successful." });
  } catch (e) {
    res
      .status(500)
      .json({ error: "Internal server error", details: e.message });
  }
};
