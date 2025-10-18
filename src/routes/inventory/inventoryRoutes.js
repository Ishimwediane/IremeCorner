import express from 'express';
import { InventoryController } from '../../controllers/inventory/inventoryController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const inventoryController = new InventoryController();

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - minStockLevel
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           description: Current stock quantity
 *           example: 100
 *         minStockLevel:
 *           type: integer
 *           minimum: 0
 *           description: Minimum stock level for alerts
 *           example: 10
 *         maxStockLevel:
 *           type: integer
 *           minimum: 0
 *           description: Maximum stock level
 *           example: 500
 *         reservedQuantity:
 *           type: integer
 *           minimum: 0
 *           description: Reserved quantity
 *           example: 5
 *         location:
 *           type: string
 *           description: Storage location
 *           example: Warehouse A, Shelf 1
 *     
 *     StockOperation:
 *       type: object
 *       required:
 *         - quantity
 *         - reason
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity to add/remove/adjust
 *           example: 50
 *         reason:
 *           type: string
 *           description: Reason for stock operation
 *           example: Restock from supplier
 *         notes:
 *           type: string
 *           description: Additional notes
 *     
 *     StockReservation:
 *       type: object
 *       required:
 *         - quantity
 *         - orderId
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity to reserve
 *           example: 10
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Order ID for reservation
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Reservation expiry date
 */

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by product ID
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filter low stock items
 *     responses:
 *       200:
 *         description: Inventory items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/InventoryItem'
 *                     pagination:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', inventoryController.getInventoryItems);

/**
 * @swagger
 * /inventory/dashboard:
 *   get:
 *     summary: Get inventory dashboard data
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalValue:
 *                       type: number
 *                     lowStockCount:
 *                       type: integer
 *                     outOfStockCount:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', inventoryController.getInventoryDashboard);

/**
 * @swagger
 * /inventory/analytics:
 *   get:
 *     summary: Get inventory analytics
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics', inventoryController.getInventoryAnalytics);

/**
 * @swagger
 * /inventory/transactions:
 *   get:
 *     summary: Get inventory transactions
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [add, remove, adjust, reserve, release]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/transactions', inventoryController.getInventoryTransactions);

/**
 * @swagger
 * /inventory/low-stock:
 *   get:
 *     summary: Get low stock alerts
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock alerts retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/low-stock', inventoryController.getLowStockAlerts);

/**
 * @swagger
 * /inventory/out-of-stock:
 *   get:
 *     summary: Get out of stock items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Out of stock items retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/out-of-stock', inventoryController.getOutOfStockItems);

/**
 * @swagger
 * /inventory/{itemId}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.get('/:itemId', validateUUID, inventoryController.getInventoryItem);

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Create inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', inventoryController.createInventoryItem);

/**
 * @swagger
 * /inventory/{itemId}:
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.put('/:itemId', validateUUID, inventoryController.updateInventoryItem);

/**
 * @swagger
 * /inventory/{itemId}:
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.delete('/:itemId', validateUUID, inventoryController.deleteInventoryItem);

/**
 * @swagger
 * /inventory/{itemId}/add-stock:
 *   post:
 *     summary: Add stock to inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockOperation'
 *     responses:
 *       200:
 *         description: Stock added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.post('/:itemId/add-stock', validateUUID, inventoryController.addStock);

/**
 * @swagger
 * /inventory/{itemId}/remove-stock:
 *   post:
 *     summary: Remove stock from inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockOperation'
 *     responses:
 *       200:
 *         description: Stock removed successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.post('/:itemId/remove-stock', validateUUID, inventoryController.removeStock);

/**
 * @swagger
 * /inventory/{itemId}/adjust-stock:
 *   post:
 *     summary: Adjust stock level for inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newQuantity
 *               - reason
 *             properties:
 *               newQuantity:
 *                 type: integer
 *                 minimum: 0
 *                 description: New stock quantity
 *               reason:
 *                 type: string
 *                 description: Reason for adjustment
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       200:
 *         description: Stock adjusted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.post('/:itemId/adjust-stock', validateUUID, inventoryController.adjustStock);

/**
 * @swagger
 * /inventory/{itemId}/reserve-stock:
 *   post:
 *     summary: Reserve stock for order
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockReservation'
 *     responses:
 *       200:
 *         description: Stock reserved successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.post('/:itemId/reserve-stock', validateUUID, inventoryController.reserveStock);

/**
 * @swagger
 * /inventory/{itemId}/release-stock:
 *   post:
 *     summary: Release reserved stock
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - orderId
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity to release
 *               orderId:
 *                 type: string
 *                 format: uuid
 *                 description: Order ID
 *     responses:
 *       200:
 *         description: Reserved stock released successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.post('/:itemId/release-stock', validateUUID, inventoryController.releaseReservedStock);

/**
 * @swagger
 * /inventory/bulk-update:
 *   post:
 *     summary: Bulk update inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updates
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - itemId
 *                     - operation
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       format: uuid
 *                       description: Inventory item ID
 *                     operation:
 *                       type: string
 *                       enum: [add, remove, adjust, set]
 *                       description: Operation type
 *                     quantity:
 *                       type: integer
 *                       minimum: 0
 *                       description: Quantity for operation
 *                     reason:
 *                       type: string
 *                       description: Reason for update
 *     responses:
 *       200:
 *         description: Bulk update completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/bulk-update', inventoryController.bulkUpdateInventory);

/**
 * @swagger
 * /inventory/export:
 *   get:
 *     summary: Export inventory data
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, excel, json]
 *           default: csv
 *         description: Export format
 *       - in: query
 *         name: includeTransactions
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include transaction history
 *     responses:
 *       200:
 *         description: Inventory data exported successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
router.get('/export', inventoryController.exportInventory);

export default router;






