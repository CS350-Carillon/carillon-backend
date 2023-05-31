import { Router } from 'express';
import * as ChatController from '../controllers/chat.controller';

const router: Router = Router();

router.get('/:id', ChatController.listMessages);

export const chatRouter = router;
