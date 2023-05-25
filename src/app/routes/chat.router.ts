import { Router } from 'express';
import * as ChatController from '../controllers/chat.controller';
import { checkIsLoggedIn } from '../controllers/middlewares/auth.middleware';

const router: Router = Router();

router.get('/', ChatController.listChats);

router.use(checkIsLoggedIn);

router.route('/').post(ChatController.postMessage);

router.route('/:id').post(ChatController.addResponse);

export const chatRouter = router;
