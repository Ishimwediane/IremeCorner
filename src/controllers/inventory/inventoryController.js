import { InventoryService } from '../../services/inventory/inventoryService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class InventoryController {
  constructor() {
    this.inventoryService = new InventoryService();
  }

  // Get inventory items
  getInventoryItems = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, productId } = req.query;
    
    const items = await this.inventoryService.getInventoryItems(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      productId
    });

    res.json({
      success: true,
      data: items
    });
  });

  // Get inventory item by ID
  getInventoryItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const item = await this.inventoryService.getInventoryItem(itemId, req.user.id);

    res.json({
      success: true,
      data: item
    });
  });

  // Create inventory item
  createInventoryItem = asyncHandler(async (req, res) => {
    const item = await this.inventoryService.createInventoryItem(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: item
    });
  });

  // Update inventory item
  updateInventoryItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const item = await this.inventoryService.updateInventoryItem(
      itemId,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: item
    });
  });

  // Delete inventory item
  deleteInventoryItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    await this.inventoryService.deleteInventoryItem(itemId, req.user.id);

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  });

  // Add stock
  addStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason, costPrice } = req.body;
    
    const result = await this.inventoryService.addStock(
      itemId,
      quantity,
      reason,
      costPrice,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Stock added successfully',
      data: result
    });
  });

  // Remove stock
  removeStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;
    
    const result = await this.inventoryService.removeStock(
      itemId,
      quantity,
      reason,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Stock removed successfully',
      data: result
    });
  });

  // Adjust stock
  adjustStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { newQuantity, reason } = req.body;
    
    const result = await this.inventoryService.adjustStock(
      itemId,
      newQuantity,
      reason,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Stock adjusted successfully',
      data: result
    });
  });

  // Reserve stock
  reserveStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, orderId } = req.body;
    
    const result = await this.inventoryService.reserveStock(
      itemId,
      quantity,
      orderId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Stock reserved successfully',
      data: result
    });
  });

  // Release reserved stock
  releaseReservedStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, orderId } = req.body;
    
    const result = await this.inventoryService.releaseReservedStock(
      itemId,
      quantity,
      orderId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Reserved stock released successfully',
      data: result
    });
  });

  // Get low stock alerts
  getLowStockAlerts = asyncHandler(async (req, res) => {
    const alerts = await this.inventoryService.getLowStockAlerts(req.user.id);

    res.json({
      success: true,
      data: alerts
    });
  });

  // Get out of stock items
  getOutOfStockItems = asyncHandler(async (req, res) => {
    const items = await this.inventoryService.getOutOfStockItems(req.user.id);

    res.json({
      success: true,
      data: items
    });
  });

  // Get inventory analytics
  getInventoryAnalytics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const analytics = await this.inventoryService.getInventoryAnalytics(
      req.user.id,
      period
    );

    res.json({
      success: true,
      data: analytics
    });
  });

  // Get inventory transactions
  getInventoryTransactions = asyncHandler(async (req, res) => {
    const { itemId, page = 1, limit = 20 } = req.query;
    
    const transactions = await this.inventoryService.getInventoryTransactions(
      req.user.id,
      itemId,
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: transactions
    });
  });

  // Bulk update inventory
  bulkUpdateInventory = asyncHandler(async (req, res) => {
    const { updates } = req.body;
    const result = await this.inventoryService.bulkUpdateInventory(
      updates,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Bulk inventory update completed',
      data: result
    });
  });

  // Export inventory
  exportInventory = asyncHandler(async (req, res) => {
    const { format = 'csv', status } = req.query;
    const exportData = await this.inventoryService.exportInventory(
      req.user.id,
      format,
      status
    );

    res.json({
      success: true,
      message: 'Inventory exported successfully',
      data: exportData
    });
  });

  // Get inventory dashboard
  getInventoryDashboard = asyncHandler(async (req, res) => {
    const dashboard = await this.inventoryService.getInventoryDashboard(req.user.id);

    res.json({
      success: true,
      data: dashboard
    });
  });
}
