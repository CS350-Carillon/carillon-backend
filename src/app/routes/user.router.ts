import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { checkIsLoggedIn } from '../controllers/middlewares/auth.middleware';

const router: Router = Router();

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

router.use(checkIsLoggedIn);

router
  .route('/:id')
  .get(UserController.checkInformation)
  .post(UserController.editInformation);

export const userRouter = router;
