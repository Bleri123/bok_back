import express from "express";
const router = express.Router();
import {
  getActiveUsers,
  getAllUsers,
  updateUserByID,
  
} from "../controllers/usersController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isActive } from "../middlewares/isActive.js";
import { fetchAccount, fetchAccountByUserId, getallaccount_types } from "../controllers/accountController.js";
import { getAlltransaction_types } from "../controllers/transaction_typesController.js";
import { deleteAccount } from '../controllers/accountController.js';

// Get all users
router.get("/users", authenticateToken, isActive, getAllUsers);
router.get("/users/active-users", getActiveUsers);
router.get("/accounts", fetchAccount);
router.get("/accounts/:user_id", fetchAccountByUserId);
router.get( "/account_types", getallaccount_types); 
router.get("/transaction_types", getAlltransaction_types);

// UPDATE
router.put("/user/:id", authenticateToken, isAdmin, isActive, updateUserByID);

// DELETE accounts
router.delete("/account/delete/:id", authenticateToken, isAdmin, deleteAccount);

export default router;
