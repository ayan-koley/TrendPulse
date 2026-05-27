import { Router } from 'express';
import { createUser, getCurrentUser, loginUser, logoutUser, refreshRefreshToken } from '../controllers/user.controllers.ts';
import { verifyToken } from '../middlewares/auth.middlewares.ts';
const router = Router();

router.route('/create').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyToken, logoutUser);
router.route('/refresh-token').post(refreshRefreshToken);
router.route('/me').get(verifyToken, getCurrentUser);

export default router;