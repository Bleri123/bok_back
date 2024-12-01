import queries from "../db/queries.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await queries.getAllUsers();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    const result = await queries.getActiveUsers();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json("Internal server error");
  }
};

export const updateUserByID = async (req, res) => {
  const { id } = req.params;

  const {
    first_name,
    last_name,
    email,
    role_id,
    account_status_id,
    phone_number,
    city,
    zip_code,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !role_id ||
    !account_status_id ||
    !phone_number ||
    !city ||
    !zip_code
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userExist = await queries.accountExists(id);

    if (!userExist) {
      return res
        .status(400)
        .json({ error: `User with this id: ${id} not found` });
    }

    await queries.updateUser(
      first_name,
      last_name,
      email,
      role_id,
      account_status_id,
      phone_number,
      city,
      zip_code,
      id
    );

    res.status(200).json({
      message: "User update successfully",
      status: "success",
      data: [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserAccountStatuses = async (req, res) => {
  try {
    const result = await queries.getUserAccountStatuses();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json("Internal server error", e);
  }
};

export const getUserRoles = async (req, res) => {
  try {
    const result = await queries.getUserRoles();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json("Internal server error", e);
  }
};

export const userStatusTableUpdateQuery = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await queries.putUserInactive(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: `No user found with this id: ${id}` });
    }

    res
      .status(200)
      .json({ message: `User with id: ${id} updated successfully` });
  } catch (e) {
    console.log("e", e);

    res.status(500).json({ error: "Internal server error", e });
  }
};
