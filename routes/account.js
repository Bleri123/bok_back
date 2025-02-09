import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isActive } from "../middlewares/isActive.js";
import {
  checkIfUserHasDebitAccount,
  fetchAccount,
  fetchAccountByUserId,
  fetchLoggedUserAccount,
  getAccountInformation,
  getAccountsReports,
  userWithdrawMoney,
  getAccountTypes,
  getAllAcountsForUser,
  addAccount,
  getAccountStatuses,
  getMissingAccountTypes,
  accountStatusUpdate,
  reportAccount,
  userReport,
  checkIfAccountExists,
  userDepositMoney,
} from "../controllers/accountController.js";
import { deleteAccount } from "../controllers/accountController.js";
import express from "express";
const router = express.Router();

router.get("/all", authenticateToken, isAdmin, getAllAcountsForUser);
router.get("/", authenticateToken, fetchAccount);
router.get("/reports", authenticateToken, getAccountsReports);
router.delete("/delete/:id", authenticateToken, isAdmin, deleteAccount);
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
router.get(
  "/user/account/info/:account_id",
  authenticateToken,
  getAccountInformation
);
router.get("/types/account", authenticateToken, isActive, getAccountTypes);
router.post("/accountsss/add", addAccount);
router.get(
  "/statuses/account-statuses",
  authenticateToken,
  isActive,
  getAccountStatuses
);
router.get(
  "/user/missing-account-types/:user_id",
  authenticateToken,
  getMissingAccountTypes
);
router.post(
  "/account/status/update",
  authenticateToken,
  isAdmin,
  accountStatusUpdate
);

router.get("/admin/user-report", authenticateToken, isAdmin, reportAccount);
router.get("/users/user-report", authenticateToken, userReport);
router.post(
  "/check-account/account-number",
  authenticateToken,
  checkIfAccountExists
);

router.post("/user/deposit", authenticateToken, userDepositMoney);
export default router;
