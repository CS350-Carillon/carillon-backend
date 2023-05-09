import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router: Router = Router();

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

router
  .route('/:id')
  .get(UserController.checkInformation)
  .post(UserController.editInformation);

export const userRouter = router;
