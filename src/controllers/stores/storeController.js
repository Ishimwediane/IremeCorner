import { StoreService } from '../../services/stores/storeService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class StoreController {
  constructor() {
    this.storeService = new StoreService();
  }

  // Get store by ID or slug
  getStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const store = await this.storeService.getStore(storeId);

    res.json({
      success: true,
      data: store
    });
  });

  // Get user's store
  getMyStore = asyncHandler(async (req, res) => {
    const store = await this.storeService.getUserStore(req.user.id);

    res.json({
      success: true,
      data: store
    });
  });

  // Create store
  createStore = asyncHandler(async (req, res) => {
    const store = await this.storeService.createStore(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });
  });

  // Update store
  updateStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const store = await this.storeService.updateStore(
      storeId,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: store
    });
  });

  // Get store products
  getStoreProducts = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { page = 1, limit = 20, status, category } = req.query;
    
    const products = await this.storeService.getStoreProducts(storeId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      category
    });

    res.json({
      success: true,
      data: products
    });
  });

  // Get store courses
  getStoreCourses = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { page = 1, limit = 20, status, level } = req.query;
    
    const courses = await this.storeService.getStoreCourses(storeId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      level
    });

    res.json({
      success: true,
      data: courses
    });
  });

  // Get store reviews
  getStoreReviews = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;
    
    const reviews = await this.storeService.getStoreReviews(storeId, {
      page: parseInt(page),
      limit: parseInt(limit),
      rating
    });

    res.json({
      success: true,
      data: reviews
    });
  });

  // Get store analytics
  getStoreAnalytics = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { period = '30d' } = req.query;
    
    const analytics = await this.storeService.getStoreAnalytics(
      storeId,
      req.user.id,
      period
    );

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get store statistics
  getStoreStats = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const stats = await this.storeService.getStoreStats(storeId);

    res.json({
      success: true,
      data: stats
    });
  });

  // Follow store
  followStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const result = await this.storeService.followStore(storeId, req.user.id);

    res.json({
      success: true,
      message: 'Store followed successfully',
      data: result
    });
  });

  // Unfollow store
  unfollowStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    await this.storeService.unfollowStore(storeId, req.user.id);

    res.json({
      success: true,
      message: 'Store unfollowed successfully'
    });
  });

  // Get store followers
  getStoreFollowers = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const followers = await this.storeService.getStoreFollowers(storeId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: followers
    });
  });

  // Search stores
  searchStores = asyncHandler(async (req, res) => {
    const { q, type, location, page = 1, limit = 20 } = req.query;
    
    const stores = await this.storeService.searchStores({
      query: q,
      type,
      location,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: stores
    });
  });

  // Get featured stores
  getFeaturedStores = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const stores = await this.storeService.getFeaturedStores(parseInt(limit));

    res.json({
      success: true,
      data: stores
    });
  });

  // Verify store (Admin only)
  verifyStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const store = await this.storeService.verifyStore(storeId);

    res.json({
      success: true,
      message: 'Store verified successfully',
      data: store
    });
  });

  // Suspend store (Admin only)
  suspendStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { reason } = req.body;
    const store = await this.storeService.suspendStore(storeId, reason);

    res.json({
      success: true,
      message: 'Store suspended successfully',
      data: store
    });
  });
}



