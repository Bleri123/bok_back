import authenticateToken from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isActive } from '../middlewares/isActive.js';
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
} from '../controllers/accountController.js';
import { deleteAccount } from '../controllers/accountController.js';
import express from 'express';
const router = express.Router();

router.get('/all', authenticateToken, isAdmin, getAllAcountsForUser);
router.get('/', authenticateToken, fetchAccount);
router.get('/reports', authenticateToken, getAccountsReports);
router.delete('/delete/:id', authenticateToken, isAdmin, deleteAccount);
router.get(
  '/:user_id',
  authenticateToken,
  isActive,
  isAdmin,
  fetchAccountByUserId
);

router.get('/logged/user', authenticateToken, isActive, fetchLoggedUserAccount);
router.get('/reports', authenticateToken, getAccountsReports);
router.delete('/delete/:id', authenticateToken, isAdmin, deleteAccount);
router.get('/user/has-debit', authenticateToken, checkIfUserHasDebitAccount);
router.post('/user/withdraw', authenticateToken, userWithdrawMoney);
router.get(
  '/user/account/info/:account_id',
  authenticateToken,
  getAccountInformation
);
router.get('/types/account', authenticateToken, isActive, getAccountTypes);
export default router;
