import { SearchService } from '../../services/search/searchService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class SearchController {
  constructor() {
    this.searchService = new SearchService();
  }

  // Global search
  globalSearch = asyncHandler(async (req, res) => {
    const { q, type, page = 1, limit = 20 } = req.query;
    const results = await this.searchService.globalSearch(q, {
      type,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: results
    });
  });

  // Search products
  searchProducts = asyncHandler(async (req, res) => {
    const { 
      q, 
      category, 
      minPrice, 
      maxPrice, 
      rating, 
      artisanId,
      sortBy = 'relevance',
      page = 1, 
      limit = 20 
    } = req.query;

    const results = await this.searchService.searchProducts({
      query: q,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      rating: rating ? parseInt(rating) : undefined,
      artisanId,
      sortBy,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: results
    });
  });

  // Search courses
  searchCourses = asyncHandler(async (req, res) => {
    const { 
      q, 
      level, 
      minPrice, 
      maxPrice, 
      rating,
      instructorId,
      duration,
      sortBy = 'relevance',
      page = 1, 
      limit = 20 
    } = req.query;

    const results = await this.searchService.searchCourses({
      query: q,
      level,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      rating: rating ? parseInt(rating) : undefined,
      instructorId,
      duration: duration ? parseInt(duration) : undefined,
      sortBy,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: results
    });
  });

  // Search users (Admin only)
  searchUsers = asyncHandler(async (req, res) => {
    const { 
      q, 
      role, 
      isActive,
      sortBy = 'name',
      page = 1, 
      limit = 20 
    } = req.query;

    const results = await this.searchService.searchUsers({
      query: q,
      role,
      isActive: isActive ? isActive === 'true' : undefined,
      sortBy,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: results
    });
  });

  // Get search suggestions
  getSearchSuggestions = asyncHandler(async (req, res) => {
    const { q, type } = req.query;
    const suggestions = await this.searchService.getSearchSuggestions(q, type);

    res.json({
      success: true,
      data: suggestions
    });
  });

  // Get popular searches
  getPopularSearches = asyncHandler(async (req, res) => {
    const { limit = 10, type } = req.query;
    const popularSearches = await this.searchService.getPopularSearches(
      parseInt(limit),
      type
    );

    res.json({
      success: true,
      data: popularSearches
    });
  });

  // Get search filters
  getSearchFilters = asyncHandler(async (req, res) => {
    const { type } = req.query;
    const filters = await this.searchService.getSearchFilters(type);

    res.json({
      success: true,
      data: filters
    });
  });

  // Advanced search
  advancedSearch = asyncHandler(async (req, res) => {
    const searchCriteria = req.body;
    const results = await this.searchService.advancedSearch(searchCriteria);

    res.json({
      success: true,
      data: results
    });
  });

  // Save search (for analytics)
  saveSearch = asyncHandler(async (req, res) => {
    const { query, type, filters } = req.body;
    await this.searchService.saveSearch({
      userId: req.user?.id,
      query,
      type,
      filters,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Search saved successfully'
    });
  });

  // Get search analytics (Admin only)
  getSearchAnalytics = asyncHandler(async (req, res) => {
    const { period = '7d', type } = req.query;
    const analytics = await this.searchService.getSearchAnalytics(period, type);

    res.json({
      success: true,
      data: analytics
    });
  });
}




