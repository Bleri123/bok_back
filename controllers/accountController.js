import queries from "../db/queries.js";

export const deleteAccount = async (req, res) => {
  const id = req.params.id;

  try {
    const exists = await queries.accountExists(id);
    if (!exists) {
      return res.status(400).json({ error: "Account does not exist" });
    }

    const deleteAcc = await queries.deleteAccount(id);

    // couldn't be deleted successfuly
    if (!deleteAcc) {
      res.status(500).json("Account could not be deleted");
    }

    res.status(200).json("Account deleted");
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export const fetchAccount = async (req, res) => {
  const user_id = req.user.id;
  try {
    const account = await queries.getAccountByUserId(user_id);
    res.send(account);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const fetchAccountByUserId = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await queries.getAccountByUserId(user_id);
    res.send(result);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const fetchLoggedUserAccount = async (req, res) => {
  const user_id = req.user?.id;
  try {
    const result = await queries.getAccountByUserId(user_id);
    res.send(result);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const getAccountsReports = async (req, res) => {
  const user_id = req.user.id;
  const { since_date } = req.query;
  try {
    const reports = await queries.getAccountTransactionSinceDate(
      user_id,
      since_date
    );
    res.send(reports);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const checkIfUserHasDebitAccount = async (req, res) => {
  console.log("encoded user", req.user);
  const user_id = req?.user?.id;

  try {
    const response = await queries.checkIfUserHasDebitAccount(user_id);
    console.log("response", response);

    if (response?.length <= 0) {
      return res.status(500).json("Internal server error");
    }

    const hasDebitAccount = response[0]?.count > 0;
    res.send(hasDebitAccount ? "true" : "false");
  } catch (e) {
    console.log("error:", e);
    res.status(500).json("Internal server error");
  }
};

export const userWithdrawMoney = async (req, res) => {
  const user_id = req?.user?.id;
  const chosen_value = parseFloat(req?.body?.chosen_value);
  const account_type_id = req?.body?.account_type_id;

  // const account_type_id = 1;
  const transaction_type_id = 2; // THIS IS WITHDRAW
  const transaction_fee_id = 2;

  try {
    // Fetch user balance
    const userAccountData = await queries.getUserBalance(
      user_id,
      account_type_id
    );
    if (userAccountData.length === 0) {
      return res
        .status(400)
        .json({ message: "User must have a valid account to make a withdraw" });
    }

    const { balance: rawBalance, id: user_account_id } = userAccountData[0];
    const balance = parseFloat(rawBalance);

    // Fetch transaction fee
    const transactionFeeData = await queries.getTransactionFee(
      transaction_type_id
    );
    if (transactionFeeData.length === 0) {
      return res
        .status(400)
        .json({ message: "Failed to retrieve transaction fee" });
    }

    const transfer_fee = parseFloat(transactionFeeData[0]?.fixed_fee);
    const total_with_transfer_fee = chosen_value + transfer_fee;

    if (total_with_transfer_fee > balance) {
      return res
        .status(400)
        .json({ message: "Insufficient funds for the transaction" });
    }

    // Begin withdrawal process
    const transactionResponse = await queries.createNewTransaction(
      transaction_type_id,
      transaction_fee_id,
      total_with_transfer_fee
    );
    const new_transaction_id = transactionResponse?.insertId;

    const new_balance = balance - total_with_transfer_fee;
    await queries.reduceBalance(new_balance, user_id, account_type_id);

    await queries.createAccountTransaction(
      user_account_id,
      new_transaction_id,
      "WITHDRAW"
    );

    return res.status(200).json({
      message: `Successfully withdrew: ${total_with_transfer_fee}€ (fee included)`,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return res.status(500).json("Internal server error");
  }
};

export const getAccountInformation = async (req, res) => {
  const user_id = req.user?.id;
  const account_id = req.params.account_id;

  try {
    const result = await queries.getAccountInformation(user_id, account_id);
    res.send(result);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const getAccountTypes = async (req, res) => {
  try {
    const result = await queries.getAccountTypes();
    res.send(result);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};
