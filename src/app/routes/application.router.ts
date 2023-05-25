import express, { Router } from 'express';
import { userRouter } from './user.router';
import { workspaceRouter } from './workspace.router';
import { channelRouter } from './channel.router';
import { chatRouter } from './chat.router';

const router: Router = express.Router();
router.use('/users', userRouter);
router.use('/workspaces', workspaceRouter);
router.use('/channels', channelRouter);
router.use('/chats', chatRouter);

export const applicationRouter: Router = router;
