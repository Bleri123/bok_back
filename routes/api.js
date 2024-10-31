import express from "express";
import accountRouter from './account.js'
import userRouter from './user.js';
import transactionRouter from './transactions.js';
const router = express.Router();

router.use('/accounts', accountRouter);
router.use('/users', userRouter);
router.use('/transactions', transactionRouter);

export default router;
