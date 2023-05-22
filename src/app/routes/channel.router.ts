import { Router } from 'express';
import * as ChannelController from '../controllers/channel.controller';
import { checkIsLoggedIn } from '../controllers/middlewares/auth.middleware';

const router: Router = Router();

router.get('/', ChannelController.listChannel);

router.use(checkIsLoggedIn);

router
  .route('/')
  .post(ChannelController.createChannel)
  .delete(ChannelController.deleteChannel);

export const channelRouter = router;
