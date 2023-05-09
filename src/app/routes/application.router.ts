import express, { Router } from 'express';
import { userRouter } from './user.router';

const router: Router = express.Router();
router.use('/user', userRouter);

export const applicationRouter: Router = router;
