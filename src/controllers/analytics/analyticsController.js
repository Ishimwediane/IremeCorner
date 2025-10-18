import { AnalyticsService } from '../../services/analytics/analyticsService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class AnalyticsController {
  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  // Track event
  trackEvent = asyncHandler(async (req, res) => {
    const eventData = {
      ...req.body,
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      sessionId: req.session?.id
    };

    const event = await this.analyticsService.trackEvent(eventData);

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      data: event
    });
  });

  // Get sales analytics
  getSalesAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d', granularity = 'day' } = req.query;
    const analytics = await this.analyticsService.getSalesAnalytics(
      req.user.id,
      period,
      granularity
    );

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get user analytics
  getUserAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const analytics = await this.analyticsService.getUserAnalytics(period);

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get product analytics
  getProductAnalytics = asyncHandler(async (req, res) => {
    const { productId, period = '30d' } = req.query;
    const analytics = await this.analyticsService.getProductAnalytics(
      productId,
      period
    );

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get course analytics
  getCourseAnalytics = asyncHandler(async (req, res) => {
    const { courseId, period = '30d' } = req.query;
    const analytics = await this.analyticsService.getCourseAnalytics(
      courseId,
      period
    );

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get engagement analytics
  getEngagementAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const analytics = await this.analyticsService.getEngagementAnalytics(period);

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get revenue analytics
  getRevenueAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d', granularity = 'day' } = req.query;
    const analytics = await this.analyticsService.getRevenueAnalytics(
      req.user.id,
      period,
      granularity
    );

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get conversion analytics
  getConversionAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const analytics = await this.analyticsService.getConversionAnalytics(period);

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get performance analytics
  getPerformanceAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const analytics = await this.analyticsService.getPerformanceAnalytics(period);

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get custom analytics
  getCustomAnalytics = asyncHandler(async (req, res) => {
    const { metrics, dimensions, filters, period = '30d' } = req.body;
    
    const analytics = await this.analyticsService.getCustomAnalytics({
      metrics,
      dimensions,
      filters,
      period
    });

    res.json({
      success: true,
      data: analytics
    });
  });

  // Export analytics data
  exportAnalytics = asyncHandler(async (req, res) => {
    const { type, period = '30d', format = 'csv' } = req.query;
    const exportData = await this.analyticsService.exportAnalytics(
      type,
      period,
      format
    );

    res.json({
      success: true,
      message: 'Analytics data exported successfully',
      data: exportData
    });
  });

  // Get real-time analytics
  getRealTimeAnalytics = asyncHandler(async (req, res) => {
    const analytics = await this.analyticsService.getRealTimeAnalytics();

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get analytics dashboard
  getAnalyticsDashboard = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const dashboard = await this.analyticsService.getAnalyticsDashboard(
      req.user.id,
      period
    );

    res.json({
      success: true,
      data: dashboard
    });
  });
}






