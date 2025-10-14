import { PromotionService } from '../../services/promotions/promotionService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class PromotionController {
  constructor() {
    this.promotionService = new PromotionService();
  }

  // Get all promotions
  getPromotions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, type, isPublic } = req.query;
    
    const promotions = await this.promotionService.getPromotions({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      type,
      isPublic: isPublic === 'true'
    });

    res.json({
      success: true,
      data: promotions
    });
  });

  // Get promotion by code
  getPromotionByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const promotion = await this.promotionService.getPromotionByCode(code);

    res.json({
      success: true,
      data: promotion
    });
  });

  // Validate promotion code
  validatePromotionCode = asyncHandler(async (req, res) => {
    const { code, orderAmount, userId } = req.body;
    
    const validation = await this.promotionService.validatePromotionCode(
      code,
      orderAmount,
      userId
    );

    res.json({
      success: true,
      data: validation
    });
  });

  // Create promotion (Admin only)
  createPromotion = asyncHandler(async (req, res) => {
    const promotion = await this.promotionService.createPromotion(req.body);

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: promotion
    });
  });

  // Update promotion (Admin only)
  updatePromotion = asyncHandler(async (req, res) => {
    const { promotionId } = req.params;
    const promotion = await this.promotionService.updatePromotion(
      promotionId,
      req.body
    );

    res.json({
      success: true,
      message: 'Promotion updated successfully',
      data: promotion
    });
  });

  // Delete promotion (Admin only)
  deletePromotion = asyncHandler(async (req, res) => {
    const { promotionId } = req.params;
    await this.promotionService.deletePromotion(promotionId);

    res.json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  });

  // Activate promotion (Admin only)
  activatePromotion = asyncHandler(async (req, res) => {
    const { promotionId } = req.params;
    const promotion = await this.promotionService.activatePromotion(promotionId);

    res.json({
      success: true,
      message: 'Promotion activated successfully',
      data: promotion
    });
  });

  // Pause promotion (Admin only)
  pausePromotion = asyncHandler(async (req, res) => {
    const { promotionId } = req.params;
    const promotion = await this.promotionService.pausePromotion(promotionId);

    res.json({
      success: true,
      message: 'Promotion paused successfully',
      data: promotion
    });
  });

  // Get promotion analytics (Admin only)
  getPromotionAnalytics = asyncHandler(async (req, res) => {
    const { promotionId } = req.params;
    const { period = '30d' } = req.query;
    
    const analytics = await this.promotionService.getPromotionAnalytics(
      promotionId,
      period
    );

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get promotion usage statistics
  getPromotionStats = asyncHandler(async (req, res) => {
    const { promotionId } = req.params;
    const stats = await this.promotionService.getPromotionStats(promotionId);

    res.json({
      success: true,
      data: stats
    });
  });

  // Apply promotion to order
  applyPromotion = asyncHandler(async (req, res) => {
    const { code, orderItems } = req.body;
    
    const result = await this.promotionService.applyPromotionToOrder(
      code,
      orderItems,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Promotion applied successfully',
      data: result
    });
  });

  // Get user's promotion usage
  getUserPromotionUsage = asyncHandler(async (req, res) => {
    const { promotionId } = req.params;
    const usage = await this.promotionService.getUserPromotionUsage(
      promotionId,
      req.user.id
    );

    res.json({
      success: true,
      data: usage
    });
  });

  // Get available promotions for user
  getAvailablePromotions = asyncHandler(async (req, res) => {
    const { orderAmount } = req.query;
    const promotions = await this.promotionService.getAvailablePromotions(
      req.user.id,
      parseFloat(orderAmount) || 0
    );

    res.json({
      success: true,
      data: promotions
    });
  });

  // Get promotion templates (Admin only)
  getPromotionTemplates = asyncHandler(async (req, res) => {
    const templates = await this.promotionService.getPromotionTemplates();

    res.json({
      success: true,
      data: templates
    });
  });

  // Create promotion from template (Admin only)
  createFromTemplate = asyncHandler(async (req, res) => {
    const { templateId, customizations } = req.body;
    
    const promotion = await this.promotionService.createFromTemplate(
      templateId,
      customizations
    );

    res.status(201).json({
      success: true,
      message: 'Promotion created from template successfully',
      data: promotion
    });
  });
}
