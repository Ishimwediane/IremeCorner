import express from 'express';
import { SocialController } from '../../controllers/social/socialController.js';
import { authenticateToken, optionalAuth } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const socialController = new SocialController();

// Public routes
router.get('/feed', optionalAuth, socialController.getSocialFeed);
router.get('/posts/:postId', validateUUID, socialController.getPost);
router.get('/posts/:postId/comments', validateUUID, socialController.getPostComments);
router.get('/users/:userId/posts', validateUUID, socialController.getUserPosts);
router.get('/users/:userId/followers', validateUUID, socialController.getUserFollowers);
router.get('/users/:userId/following', validateUUID, socialController.getUserFollowing);
router.get('/search', socialController.searchPosts);
router.get('/trending', socialController.getTrendingPosts);

// Authenticated routes
router.use(authenticateToken);

// Post management
router.post('/posts', socialController.createPost);
router.put('/posts/:postId', validateUUID, socialController.updatePost);
router.delete('/posts/:postId', validateUUID, socialController.deletePost);
router.post('/posts/:postId/like', validateUUID, socialController.likePost);
router.post('/posts/:postId/share', validateUUID, socialController.sharePost);

// Comment management
router.post('/posts/:postId/comments', validateUUID, socialController.addComment);
router.put('/comments/:commentId', validateUUID, socialController.updateComment);
router.delete('/comments/:commentId', validateUUID, socialController.deleteComment);
router.post('/comments/:commentId/like', validateUUID, socialController.likeComment);

// User following
router.post('/users/:userId/follow', validateUUID, socialController.followUser);
router.delete('/users/:userId/follow', validateUUID, socialController.unfollowUser);

// Analytics
router.get('/analytics', socialController.getSocialAnalytics);

export default router;






