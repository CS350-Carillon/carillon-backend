import { Router } from 'express';
import * as WorkspaceController from '../controllers/workspace.controller';
import { checkIsLoggedIn } from '../controllers/middlewares/auth.middleware';

const router: Router = Router();

router.get('/', WorkspaceController.listWorkspace);

router.use(checkIsLoggedIn);

router
  .route('/')
  .post(WorkspaceController.createWorkspace)
  .delete(WorkspaceController.deleteWorkspace);

export const workspaceRouter = router;
