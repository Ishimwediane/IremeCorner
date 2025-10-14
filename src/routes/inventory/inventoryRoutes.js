import express from 'express';
import { InventoryController } from '../../controllers/inventory/inventoryController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const inventoryController = new InventoryController();

// All routes require authentication
router.use(authenticateToken);

// Inventory management
router.get('/', inventoryController.getInventoryItems);
router.get('/dashboard', inventoryController.getInventoryDashboard);
router.get('/analytics', inventoryController.getInventoryAnalytics);
router.get('/transactions', inventoryController.getInventoryTransactions);
router.get('/low-stock', inventoryController.getLowStockAlerts);
router.get('/out-of-stock', inventoryController.getOutOfStockItems);

// Individual inventory item
router.get('/:itemId', validateUUID, inventoryController.getInventoryItem);
router.post('/', inventoryController.createInventoryItem);
router.put('/:itemId', validateUUID, inventoryController.updateInventoryItem);
router.delete('/:itemId', validateUUID, inventoryController.deleteInventoryItem);

// Stock operations
router.post('/:itemId/add-stock', validateUUID, inventoryController.addStock);
router.post('/:itemId/remove-stock', validateUUID, inventoryController.removeStock);
router.post('/:itemId/adjust-stock', validateUUID, inventoryController.adjustStock);
router.post('/:itemId/reserve-stock', validateUUID, inventoryController.reserveStock);
router.post('/:itemId/release-stock', validateUUID, inventoryController.releaseReservedStock);

// Bulk operations
router.post('/bulk-update', inventoryController.bulkUpdateInventory);
router.get('/export', inventoryController.exportInventory);

export default router;
