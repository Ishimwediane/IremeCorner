import express from 'express';
import { WishlistController } from '../../controllers/wishlist/wishlistController.js';
import { authenticateToken } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const wishlistController = new WishlistController();

// All routes require authentication
router.use(authenticateToken);

// Wishlist management routes
router.get('/', wishlistController.getWishlist);
router.get('/stats', wishlistController.getWishlistStats);
router.get('/check', wishlistController.checkInWishlist);

// Add to wishlist
router.post('/products/:productId', validateUUID, wishlistController.addProductToWishlist);
router.post('/courses/:courseId', validateUUID, wishlistController.addCourseToWishlist);

// Remove from wishlist
router.delete('/products/:productId', validateUUID, wishlistController.removeProductFromWishlist);
router.delete('/courses/:courseId', validateUUID, wishlistController.removeCourseFromWishlist);

// Wishlist item management
router.put('/:wishlistItemId', validateUUID, wishlistController.updateWishlistItem);
router.delete('/:wishlistItemId', validateUUID, wishlistController.removeWishlistItem);
router.post('/:wishlistItemId/move-to-cart', validateUUID, wishlistController.moveToCart);

// Sharing
router.post('/share', wishlistController.shareWishlist);
router.get('/shared/:shareToken', wishlistController.getSharedWishlist);

export default router;




