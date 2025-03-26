import Express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  like,
} from '../controllers/postController';
import {
  createPostValidationRules,
  deletePostValidationRules,
  updatePostValidationRules,
  getPostValidationRules,
  getPostsValidationRules,
  validatePost,
  likePostValidationRules,
} from '../validators/postValidator';
import {
  authOnlyLoggedIn,
  authWithPostId,
} from '../middlewares/authMiddleware';

const router = Express.Router({ mergeParams: true });

router.post(
  '/',
  createPostValidationRules(),
  validatePost,
  authOnlyLoggedIn,
  createPost
);
router.put(
  '/:postId',
  updatePostValidationRules(),
  validatePost,
  authWithPostId,
  updatePost
);
router.delete(
  '/:postId',
  deletePostValidationRules(),
  validatePost,
  authWithPostId,
  deletePost
);
router.get('/:postId', getPostValidationRules(), validatePost, getPost);
router.get('/', getPostsValidationRules(), validatePost, getPosts);
router.post(
  '/like/:postId',
  authOnlyLoggedIn,
  likePostValidationRules(),
  validatePost,
  like
);
export default router;
