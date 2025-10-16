import express from 'express';
import { ReviewController } from '../../controllers/reviews/reviewController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const reviewController = new ReviewController();

// Public routes
router.get('/products/:productId', validateUUID, reviewController.getProductReviews);
router.get('/courses/:courseId', validateUUID, reviewController.getCourseReviews);
router.get('/stats', reviewController.getReviewStats);

// Authenticated routes
router.use(authenticateToken);

// User review routes
router.post('/products/:productId', validateUUID, reviewController.addProductReview);
router.post('/courses/:courseId', validateUUID, reviewController.addCourseReview);
router.post('/users/:userId', validateUUID, reviewController.addUserReview);
router.put('/:reviewId', validateUUID, reviewController.updateReview);
router.delete('/:reviewId', validateUUID, reviewController.deleteReview);
router.put('/:reviewId/helpful', validateUUID, reviewController.markAsHelpful);
router.post('/:reviewId/report', validateUUID, reviewController.reportReview);
router.get('/my-reviews', reviewController.getMyReviews);

// Admin moderation routes
router.get('/moderation', requireRole(['admin']), reviewController.getReviewsForModeration);
router.put('/:reviewId/moderate', validateUUID, requireRole(['admin']), reviewController.moderateReview);

export default router;




