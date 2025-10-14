import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from '../products/Product.js';
import { User } from '../auth/User.js';

export const InventoryActionType = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  ADJUSTMENT: 'adjustment',
  RETURN: 'return',
  DAMAGED: 'damaged',
  LOST: 'lost',
  TRANSFER: 'transfer',
};

export const InventoryStatus = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

@Entity('inventory_items')
@Index(['productId'])
@Index(['status'])
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'int', default: 0 })
  currentStock;

  @Column({ type: 'int', default: 0 })
  reservedStock; // Stock reserved for pending orders

  @Column({ type: 'int', default: 0 })
  availableStock; // currentStock - reservedStock

  @Column({ type: 'int', default: 0 })
  minimumStockLevel; // Alert threshold

  @Column({ type: 'int', default: 0 })
  maximumStockLevel; // Maximum stock capacity

  @Column({ type: 'varchar', length: 50, default: InventoryStatus.IN_STOCK })
  status;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location; // Warehouse location

  @Column({ type: 'varchar', length: 100, nullable: true })
  batchNumber; // For tracking batches

  @Column({ type: 'timestamp', nullable: true })
  expiryDate; // For perishable items

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice; // Cost per unit

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sellingPrice; // Current selling price

  @Column({ type: 'json', nullable: true })
  metadata; // Additional inventory data

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'timestamp', nullable: true })
  lastRestockedAt;

  @Column({ type: 'timestamp', nullable: true })
  lastSoldAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => Product, product => product.inventoryItems)
  @JoinColumn({ name: 'productId' })
  product;

  @Column({ type: 'uuid' })
  productId;

  @ManyToOne(() => User, user => user.managedInventory)
  @JoinColumn({ name: 'managedById' })
  managedBy;

  @Column({ type: 'uuid' })
  managedById;

  // Methods
  updateAvailableStock() {
    this.availableStock = Math.max(0, this.currentStock - this.reservedStock);
    this.updateStatus();
  }

  updateStatus() {
    if (this.currentStock <= 0) {
      this.status = InventoryStatus.OUT_OF_STOCK;
    } else if (this.currentStock <= this.minimumStockLevel) {
      this.status = InventoryStatus.LOW_STOCK;
    } else {
      this.status = InventoryStatus.IN_STOCK;
    }
  }

  addStock(quantity, reason = 'restock') {
    this.currentStock += quantity;
    this.updateAvailableStock();
    this.lastRestockedAt = new Date();
    
    // Create inventory transaction record
    return this.createTransaction(InventoryActionType.STOCK_IN, quantity, reason);
  }

  removeStock(quantity, reason = 'sale') {
    if (this.availableStock < quantity) {
      throw new Error('Insufficient stock available');
    }
    
    this.currentStock -= quantity;
    this.updateAvailableStock();
    this.lastSoldAt = new Date();
    
    // Create inventory transaction record
    return this.createTransaction(InventoryActionType.STOCK_OUT, quantity, reason);
  }

  reserveStock(quantity) {
    if (this.availableStock < quantity) {
      throw new Error('Insufficient stock available for reservation');
    }
    
    this.reservedStock += quantity;
    this.updateAvailableStock();
  }

  releaseReservation(quantity) {
    this.reservedStock = Math.max(0, this.reservedStock - quantity);
    this.updateAvailableStock();
  }

  adjustStock(newQuantity, reason = 'adjustment') {
    const difference = newQuantity - this.currentStock;
    this.currentStock = newQuantity;
    this.updateAvailableStock();
    
    // Create inventory transaction record
    return this.createTransaction(InventoryActionType.ADJUSTMENT, difference, reason);
  }

  isLowStock() {
    return this.status === InventoryStatus.LOW_STOCK;
  }

  isOutOfStock() {
    return this.status === InventoryStatus.OUT_OF_STOCK;
  }

  isExpired() {
    return this.expiryDate && new Date() > this.expiryDate;
  }

  getStockPercentage() {
    if (this.maximumStockLevel === 0) return 0;
    return Math.round((this.currentStock / this.maximumStockLevel) * 100);
  }

  createTransaction(actionType, quantity, reason) {
    // This would create an InventoryTransaction record
    return {
      actionType,
      quantity,
      reason,
      timestamp: new Date(),
      inventoryItemId: this.id
    };
  }
}
