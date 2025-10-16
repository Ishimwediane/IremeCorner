import { WishlistService } from '../../services/wishlist/wishlistService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class WishlistController {
  constructor() {
    this.wishlistService = new WishlistService();
  }

  // Get user's wishlist
  getWishlist = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type } = req.query;
    const wishlist = await this.wishlistService.getUserWishlist(
      req.user.id,
      { page: parseInt(page), limit: parseInt(limit), type }
    );

    res.json({
      success: true,
      data: wishlist
    });
  });

  // Add product to wishlist
  addProductToWishlist = asyncHandler(async (req, res) => {
    const { notes } = req.body;
    const wishlistItem = await this.wishlistService.addToWishlist(
      req.user.id,
      'product',
      req.params.productId,
      notes
    );

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: wishlistItem
    });
  });

  // Add course to wishlist
  addCourseToWishlist = asyncHandler(async (req, res) => {
    const { notes } = req.body;
    const wishlistItem = await this.wishlistService.addToWishlist(
      req.user.id,
      'course',
      req.params.courseId,
      notes
    );

    res.status(201).json({
      success: true,
      message: 'Course added to wishlist successfully',
      data: wishlistItem
    });
  });

  // Remove product from wishlist
  removeProductFromWishlist = asyncHandler(async (req, res) => {
    await this.wishlistService.removeFromWishlist(
      req.user.id,
      'product',
      req.params.productId
    );

    res.json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  });

  // Remove course from wishlist
  removeCourseFromWishlist = asyncHandler(async (req, res) => {
    await this.wishlistService.removeFromWishlist(
      req.user.id,
      'course',
      req.params.courseId
    );

    res.json({
      success: true,
      message: 'Course removed from wishlist successfully'
    });
  });

  // Update wishlist item
  updateWishlistItem = asyncHandler(async (req, res) => {
    const { notes } = req.body;
    const wishlistItem = await this.wishlistService.updateWishlistItem(
      req.params.wishlistItemId,
      req.user.id,
      { notes }
    );

    res.json({
      success: true,
      message: 'Wishlist item updated successfully',
      data: wishlistItem
    });
  });

  // Remove wishlist item
  removeWishlistItem = asyncHandler(async (req, res) => {
    await this.wishlistService.removeWishlistItem(
      req.params.wishlistItemId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Wishlist item removed successfully'
    });
  });

  // Check if item is in wishlist
  checkInWishlist = asyncHandler(async (req, res) => {
    const { type, itemId } = req.query;
    const isInWishlist = await this.wishlistService.isInWishlist(
      req.user.id,
      type,
      itemId
    );

    res.json({
      success: true,
      data: { isInWishlist }
    });
  });

  // Get wishlist statistics
  getWishlistStats = asyncHandler(async (req, res) => {
    const stats = await this.wishlistService.getWishlistStats(req.user.id);

    res.json({
      success: true,
      data: stats
    });
  });

  // Move wishlist item to cart (if it's a product)
  moveToCart = asyncHandler(async (req, res) => {
    const { quantity = 1 } = req.body;
    const result = await this.wishlistService.moveToCart(
      req.params.wishlistItemId,
      req.user.id,
      quantity
    );

    res.json({
      success: true,
      message: 'Item moved to cart successfully',
      data: result
    });
  });

  // Share wishlist
  shareWishlist = asyncHandler(async (req, res) => {
    const { shareType = 'public' } = req.body; // 'public', 'private', 'link'
    const shareData = await this.wishlistService.shareWishlist(
      req.user.id,
      shareType
    );

    res.json({
      success: true,
      message: 'Wishlist shared successfully',
      data: shareData
    });
  });

  // Get shared wishlist (public)
  getSharedWishlist = asyncHandler(async (req, res) => {
    const wishlist = await this.wishlistService.getSharedWishlist(
      req.params.shareToken
    );

    res.json({
      success: true,
      data: wishlist
    });
  });
}



