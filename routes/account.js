import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isActive } from "../middlewares/isActive.js";
import {
  checkIfUserHasDebitAccount,
  fetchAccount,
  fetchAccountByUserId,
  fetchLoggedUserAccount,
  getAccountsReports,
  userWithdrawMoney,
} from "../controllers/accountController.js";
import { deleteAccount } from "../controllers/accountController.js";
import express from "express";
const router = express.Router();

router.get("/", authenticateToken, fetchAccount);
router.get(
  "/:user_id",
  authenticateToken,
  isActive,
  isAdmin,
  fetchAccountByUserId
);
router.get("/logged/user", authenticateToken, isActive, fetchLoggedUserAccount);
router.get("/reports", authenticateToken, getAccountsReports);
router.delete("/delete/:id", authenticateToken, isAdmin, deleteAccount);
router.get("/user/has-debit", authenticateToken, checkIfUserHasDebitAccount);
router.post("/user/withdraw", authenticateToken, userWithdrawMoney);
export default router;
