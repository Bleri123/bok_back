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
    await queries.updateBalance(new_balance, user_id, account_type_id);

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

export const userDepositMoney = async (req, res) => {
  const user_id = req?.user?.id;
  const chosen_value = parseFloat(req?.body?.chosen_value);
  const account_type_id = req?.body?.account_type_id;

  const transaction_type_id = 1;
  const transaction_fee_id = 1;

  try {
    const userAccountData = await queries.getUserBalance(
      user_id,
      account_type_id
    );
    if (userAccountData.length === 0) {
      return res
        .status(400)
        .json({ message: "User must have a valid account to make a deposit" });
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
    const total_with_transfer_fee = chosen_value - transfer_fee;

    // Begin deposit process
    const transactionResponse = await queries.createNewTransaction(
      transaction_type_id,
      transaction_fee_id,
      total_with_transfer_fee
    );
    const new_transaction_id = transactionResponse?.insertId;

    // Since this is an ATM deposit, we don't need to check the balance
    // We directly proceed to increase the balance
    const new_balance = total_with_transfer_fee;
    const total_user_balance = balance + total_with_transfer_fee;
    await queries.updateBalance(total_user_balance, user_id, account_type_id);

    await queries.createAccountTransaction(
      user_account_id,
      new_transaction_id,
      "DEPOSIT"
    );

    return res.status(200).json({
      message: `Successfully deposited: ${total_with_transfer_fee.toFixed(
        2
      )}€ (fee included)`,
    });
  } catch (error) {
    console.error("Error processing deposit:", error);
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

export const getAllAcountsForUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const accounts = await queries.getAllAccounts(userId);
    res.json(accounts);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const addAccount = async (req, res) => {
  try {
    // Destructure required fields from the request body
    const { user_id, account_type_id } = req.body;

    // Optional: Validate the incoming data
    if (!user_id || !account_type_id) {
      return res.status(400).json("Missing required fields");
    }

    // Call the query function to add the account
    const result = await queries.addAccount({
      user_id,
      account_type_id,
    });

    // Respond with success and the newly created account data
    res.status(201).json({
      message: "Account created successfully",
      account: result,
    });
  } catch (e) {
    console.error(e); // Logging the error might help in debugging
    res.status(500).json("Internal server error");
  }
};

export const getAccountStatuses = async (req, res) => {
  try {
    const result = await queries.getAccountStatuses();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const getMissingAccountTypes = async (req, res) => {
  const user_id = req.params.user_id; // Assuming user_id is passed as a URL parameter
  try {
    const missingAccountTypes = await queries.getMissingAccountTypesForUser(
      user_id
    );
    res.send(missingAccountTypes);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const accountStatusUpdate = async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request body

  const { account_id, account_status_id } = req.body; // Expecting account_id and account_status_id in the request body

  try {
    if (!account_id || !account_status_id) {
      return res.status(400).json("Missing required fields");
    }

    const result = await queries.updateAccountStatus(
      account_status_id,
      account_id
    );

    if (result.affectedRows === 0) {
      return res.status(404).json("Account not found or status unchanged");
    }

    res.status(200).json("Account status updated successfully");
  } catch (error) {
    console.error("Error updating account status:", error);
    res.status(500).json("Internal server error");
  }
};

export const reportAccount = async (req, res) => {
  const { user_id, filter } = req.query;
  try {
    if (!user_id || !filter) {
      return res.status(400).json("Missing required fields");
    }

    const result = await queries.report(user_id, filter);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json("Internal server error");
  }
};

export const userReport = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const result = await queries.userReport(user_id);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating user report:", error);
    res.status(500).json("Internal server error");
  }
};

export const checkIfAccountExists = async (req, res) => {
  const receiver_account_number = req.body.receiver_account_number;
  const sender_account_number = req.body?.sender_account_number;

  try {
    const result = await queries.checkIfAccountExists(
      receiver_account_number,
      sender_account_number
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error checking if account exists:", error);
    if (error.message) {
      res.status(404).json({ error_message: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};
