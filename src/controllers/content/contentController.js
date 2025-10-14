import { ContentService } from '../../services/content/contentService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class ContentController {
  constructor() {
    this.contentService = new ContentService();
  }

  // Get content pages
  getContentPages = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type, status, visibility } = req.query;
    const pages = await this.contentService.getContentPages({
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      status,
      visibility
    });

    res.json({
      success: true,
      data: pages
    });
  });

  // Get content page by slug
  getContentPage = asyncHandler(async (req, res) => {
    const page = await this.contentService.getContentPage(req.params.slug);

    res.json({
      success: true,
      data: page
    });
  });

  // Create content page
  createContentPage = asyncHandler(async (req, res) => {
    const page = await this.contentService.createContentPage(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Content page created successfully',
      data: page
    });
  });

  // Update content page
  updateContentPage = asyncHandler(async (req, res) => {
    const page = await this.contentService.updateContentPage(
      req.params.pageId,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Content page updated successfully',
      data: page
    });
  });

  // Delete content page
  deleteContentPage = asyncHandler(async (req, res) => {
    await this.contentService.deleteContentPage(req.params.pageId, req.user.id);

    res.json({
      success: true,
      message: 'Content page deleted successfully'
    });
  });

  // Publish content page
  publishContentPage = asyncHandler(async (req, res) => {
    const page = await this.contentService.publishContentPage(
      req.params.pageId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Content page published successfully',
      data: page
    });
  });

  // Schedule content page
  scheduleContentPage = asyncHandler(async (req, res) => {
    const { scheduledAt } = req.body;
    const page = await this.contentService.scheduleContentPage(
      req.params.pageId,
      scheduledAt,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Content page scheduled successfully',
      data: page
    });
  });

  // Archive content page
  archiveContentPage = asyncHandler(async (req, res) => {
    const page = await this.contentService.archiveContentPage(
      req.params.pageId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Content page archived successfully',
      data: page
    });
  });

  // Get media files
  getMediaFiles = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type, status } = req.query;
    const files = await this.contentService.getMediaFiles({
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      status
    });

    res.json({
      success: true,
      data: files
    });
  });

  // Upload media file
  uploadMediaFile = asyncHandler(async (req, res) => {
    const file = await this.contentService.uploadMediaFile(
      req.file,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Media file uploaded successfully',
      data: file
    });
  });

  // Get media file by ID
  getMediaFile = asyncHandler(async (req, res) => {
    const file = await this.contentService.getMediaFile(req.params.fileId);

    res.json({
      success: true,
      data: file
    });
  });

  // Update media file
  updateMediaFile = asyncHandler(async (req, res) => {
    const file = await this.contentService.updateMediaFile(
      req.params.fileId,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Media file updated successfully',
      data: file
    });
  });

  // Delete media file
  deleteMediaFile = asyncHandler(async (req, res) => {
    await this.contentService.deleteMediaFile(req.params.fileId, req.user.id);

    res.json({
      success: true,
      message: 'Media file deleted successfully'
    });
  });

  // Search content
  searchContent = asyncHandler(async (req, res) => {
    const { q, type, page = 1, limit = 20 } = req.query;
    const results = await this.contentService.searchContent({
      query: q,
      type,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: results
    });
  });

  // Get content analytics
  getContentAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const analytics = await this.contentService.getContentAnalytics(period);

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get content templates
  getContentTemplates = asyncHandler(async (req, res) => {
    const templates = await this.contentService.getContentTemplates();

    res.json({
      success: true,
      data: templates
    });
  });

  // Create content from template
  createFromTemplate = asyncHandler(async (req, res) => {
    const { templateId, customizations } = req.body;
    const page = await this.contentService.createFromTemplate(
      templateId,
      customizations,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Content page created from template successfully',
      data: page
    });
  });

  // Bulk operations
  bulkUpdateContent = asyncHandler(async (req, res) => {
    const { updates } = req.body;
    const result = await this.contentService.bulkUpdateContent(
      updates,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Bulk content update completed',
      data: result
    });
  });

  // Export content
  exportContent = asyncHandler(async (req, res) => {
    const { format = 'json', type } = req.query;
    const exportData = await this.contentService.exportContent(format, type);

    res.json({
      success: true,
      message: 'Content exported successfully',
      data: exportData
    });
  });
}
