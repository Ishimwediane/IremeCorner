import { ReviewService } from '../../services/reviews/reviewService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  // Get product reviews
  getProductReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;
    const reviews = await this.reviewService.getProductReviews(
      req.params.productId,
      { page: parseInt(page), limit: parseInt(limit), rating, sortBy }
    );

    res.json({
      success: true,
      data: reviews
    });
  });

  // Get course reviews
  getCourseReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;
    const reviews = await this.reviewService.getCourseReviews(
      req.params.courseId,
      { page: parseInt(page), limit: parseInt(limit), rating, sortBy }
    );

    res.json({
      success: true,
      data: reviews
    });
  });

  // Add product review
  addProductReview = asyncHandler(async (req, res) => {
    const review = await this.reviewService.addProductReview(
      req.params.productId,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Product review added successfully',
      data: review
    });
  });

  // Add course review
  addCourseReview = asyncHandler(async (req, res) => {
    const review = await this.reviewService.addCourseReview(
      req.params.courseId,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Course review added successfully',
      data: review
    });
  });

  // Add artisan/trainer review
  addUserReview = asyncHandler(async (req, res) => {
    const review = await this.reviewService.addUserReview(
      req.params.userId,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  });

  // Update review
  updateReview = asyncHandler(async (req, res) => {
    const review = await this.reviewService.updateReview(
      req.params.reviewId,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  });

  // Delete review
  deleteReview = asyncHandler(async (req, res) => {
    await this.reviewService.deleteReview(req.params.reviewId, req.user.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  });

  // Mark review as helpful
  markAsHelpful = asyncHandler(async (req, res) => {
    const review = await this.reviewService.markAsHelpful(
      req.params.reviewId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: review
    });
  });

  // Report review
  reportReview = asyncHandler(async (req, res) => {
    const { reason, description } = req.body;
    await this.reviewService.reportReview(
      req.params.reviewId,
      req.user.id,
      reason,
      description
    );

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  });

  // Get user's reviews
  getMyReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, type } = req.query;
    const reviews = await this.reviewService.getUserReviews(
      req.user.id,
      { page: parseInt(page), limit: parseInt(limit), type }
    );

    res.json({
      success: true,
      data: reviews
    });
  });

  // Get reviews for moderation (Admin only)
  getReviewsForModeration = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status = 'pending' } = req.query;
    const reviews = await this.reviewService.getReviewsForModeration({
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });

    res.json({
      success: true,
      data: reviews
    });
  });

  // Moderate review (Admin only)
  moderateReview = asyncHandler(async (req, res) => {
    const { action, reason } = req.body; // action: 'approve', 'reject', 'hide'
    const review = await this.reviewService.moderateReview(
      req.params.reviewId,
      action,
      reason
    );

    res.json({
      success: true,
      message: `Review ${action}d successfully`,
      data: review
    });
  });

  // Get review statistics
  getReviewStats = asyncHandler(async (req, res) => {
    const { productId, courseId, userId } = req.query;
    const stats = await this.reviewService.getReviewStats({ productId, courseId, userId });

    res.json({
      success: true,
      data: stats
    });
  });
}



