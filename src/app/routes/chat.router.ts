import { Router } from 'express';
import * as ChatController from '../controllers/chat.controller';
import { checkIsLoggedIn } from '../controllers/middlewares/auth.middleware';

const router: Router = Router();

router.use(checkIsLoggedIn);

router.route('/').post(ChatController.postMessage);

export const chatRouter = router;
