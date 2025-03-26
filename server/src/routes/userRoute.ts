import express from 'express';
import {
  redirectToGitHub,
  handleGitHubCallback,
  refreshToken,
  getMyPage,
  upsertProfile,
} from '../controllers/userController';
import { authOnlyLoggedIn } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/github', redirectToGitHub);
router.get('/github/callback', handleGitHubCallback);
router.get('/refresh-token', refreshToken);

router.get('/user/:id', authOnlyLoggedIn, getMyPage);
router.put('/user/:id', authOnlyLoggedIn, upsertProfile);

export default router;
