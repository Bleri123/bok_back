import express from "express";
import accountRouter from './account.js'
import userRouter from './user.js';
const router = express.Router();

router.use('/accounts', accountRouter);
router.use('/users', userRouter);

export default router;
