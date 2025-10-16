import { InventoryService } from '../../services/inventory/inventoryService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class InventoryController {
  constructor() {
    this.inventoryService = new InventoryService();
  }

  // Get inventory items
  getInventoryItems = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    const result = await this.inventoryService.getInventoryItems({
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    });

    res.status(200).json({
      success: true,
      message: 'Inventory items retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  // Get inventory item by ID
  getInventoryItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await this.inventoryService.getInventoryItem(id);

    res.status(200).json({
      success: true,
      message: 'Inventory item retrieved successfully',
      data: result.data
    });
  });

  // Create inventory item
  createInventoryItem = asyncHandler(async (req, res) => {
    const inventoryData = req.body;

    const result = await this.inventoryService.createInventoryItem(inventoryData);

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: result.data
    });
  });

  // Update inventory item
  updateInventoryItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await this.inventoryService.updateInventoryItem(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      data: result.data
    });
  });

  // Delete inventory item
  deleteInventoryItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await this.inventoryService.deleteInventoryItem(id);

    res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  });

  // Update inventory quantity
  updateQuantity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity, operation } = req.body; // operation: 'add', 'subtract', 'set'

    const result = await this.inventoryService.updateQuantity(id, quantity, operation);

    res.status(200).json({
      success: true,
      message: 'Inventory quantity updated successfully',
      data: result.data
    });
  });

  // Get low stock items
  getLowStockItems = asyncHandler(async (req, res) => {
    const { threshold = 10 } = req.query;

    const result = await this.inventoryService.getLowStockItems(parseInt(threshold));

    res.status(200).json({
      success: true,
      message: 'Low stock items retrieved successfully',
      data: result.data
    });
  });

  // Get inventory analytics
  getInventoryAnalytics = asyncHandler(async (req, res) => {
    const result = await this.inventoryService.getInventoryAnalytics();

    res.status(200).json({
      success: true,
      message: 'Inventory analytics retrieved successfully',
      data: result.data
    });
  });

  // Get inventory dashboard
  getInventoryDashboard = asyncHandler(async (req, res) => {
    const result = await this.inventoryService.getInventoryDashboard();

    res.status(200).json({
      success: true,
      message: 'Inventory dashboard retrieved successfully',
      data: result.data
    });
  });

  // Get inventory transactions
  getInventoryTransactions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await this.inventoryService.getInventoryTransactions({
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      message: 'Inventory transactions retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  // Get low stock alerts
  getLowStockAlerts = asyncHandler(async (req, res) => {
    const result = await this.inventoryService.getLowStockAlerts();

    res.status(200).json({
      success: true,
      message: 'Low stock alerts retrieved successfully',
      data: result.data
    });
  });

  // Get out of stock items
  getOutOfStockItems = asyncHandler(async (req, res) => {
    const result = await this.inventoryService.getOutOfStockItems();

    res.status(200).json({
      success: true,
      message: 'Out of stock items retrieved successfully',
      data: result.data
    });
  });

  // Add stock
  addStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;

    const result = await this.inventoryService.addStock(itemId, quantity, reason);

    res.status(200).json({
      success: true,
      message: 'Stock added successfully',
      data: result.data
    });
  });

  // Remove stock
  removeStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;

    const result = await this.inventoryService.removeStock(itemId, quantity, reason);

    res.status(200).json({
      success: true,
      message: 'Stock removed successfully',
      data: result.data
    });
  });

  // Adjust stock
  adjustStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;

    const result = await this.inventoryService.adjustStock(itemId, quantity, reason);

    res.status(200).json({
      success: true,
      message: 'Stock adjusted successfully',
      data: result.data
    });
  });

  // Reserve stock
  reserveStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;

    const result = await this.inventoryService.reserveStock(itemId, quantity, reason);

    res.status(200).json({
      success: true,
      message: 'Stock reserved successfully',
      data: result.data
    });
  });

  // Release reserved stock
  releaseReservedStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;

    const result = await this.inventoryService.releaseReservedStock(itemId, quantity, reason);

    res.status(200).json({
      success: true,
      message: 'Reserved stock released successfully',
      data: result.data
    });
  });

  // Bulk update inventory
  bulkUpdateInventory = asyncHandler(async (req, res) => {
    const { updates } = req.body;

    const result = await this.inventoryService.bulkUpdateInventory(updates);

    res.status(200).json({
      success: true,
      message: 'Inventory bulk updated successfully',
      data: result.data
    });
  });

  // Export inventory
  exportInventory = asyncHandler(async (req, res) => {
    const { format = 'csv' } = req.query;

    const result = await this.inventoryService.exportInventory(format);

    res.status(200).json({
      success: true,
      message: 'Inventory exported successfully',
      data: result.data
    });
  });
}