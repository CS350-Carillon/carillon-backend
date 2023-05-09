import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router: Router = Router();

router.post('/signup', UserController.signup);

export const userRouter = router;
