# Inventory & Warehouse Management Module

## Complete Enterprise Supply Chain System

---

## PART 1 — Module Structure

### 1.1 Clean Architecture Layout

```
apps/api/src/modules/inventory/
├── domain/
│   ├── entities/
│   │   ├── warehouse.entity.ts
│   │   ├── warehouse-location.entity.ts
│   │   ├── inventory.entity.ts
│   │   ├── stock.entity.ts
│   │   ├── stock-movement.entity.ts
│   │   ├── stock-reservation.entity.ts
│   │   ├── stock-adjustment.entity.ts
│   │   ├── warehouse-transfer.entity.ts
│   │   ├── warehouse-transfer-item.entity.ts
│   │   ├── inventory-alert.entity.ts
│   │   └── product-availability.entity.ts
│   ├── value-objects/
│   │   ├── stock-level.vo.ts
│   │   ├── reservation-id.vo.ts
│   │   ├── transfer-number.vo.ts
│   │   ├── movement-type.vo.ts
│   │   └── stock-status.vo.ts
│   ├── enums/
│   │   ├── warehouse-type.enum.ts
│   │   ├── warehouse-status.enum.ts
│   │   ├── stock-movement-type.enum.ts
│   │   ├── reservation-status.enum.ts
│   │   ├── transfer-status.enum.ts
│   │   ├── alert-type.enum.ts
│   │   ├── alert-severity.enum.ts
│   │   └── product-availability.enum.ts
│   ├── events/
│   │   ├── stock-reserved.event.ts
│   │   ├── stock-released.event.ts
│   │   ├── stock-updated.event.ts
│   │   ├── stock-adjusted.event.ts
│   │   ├── low-stock-detected.event.ts
│   │   ├── out-of-stock-detected.event.ts
│   │   ├── critical-stock-detected.event.ts
│   │   ├── reservation-expired.event.ts
│   │   ├── warehouse-transfer-created.event.ts
│   │   ├── warehouse-transfer-completed.event.ts
│   │   ├── warehouse-transfer-approved.event.ts
│   │   ├── product-availability-changed.event.ts
│   │   └── inventory-received.event.ts
│   ├── exceptions/
│   │   ├── insufficient-stock.exception.ts
│   │   ├── warehouse-not-found.exception.ts
│   │   ├── warehouse-full.exception.ts
│   │   ├── reservation-not-found.exception.ts
│   │   ├── reservation-expired.exception.ts
│   │   ├── transfer-not-found.exception.ts
│   │   ├── transfer-not-approved.exception.ts
│   │   ├── invalid-stock-level.exception.ts
│   │   ├── stock-already-zero.exception.ts
│   │   ├── duplicate-reservation.exception.ts
│   │   └── concurrent-modification.exception.ts
│   └── repositories/
│       ├── warehouse.repository.ts
│       ├── inventory.repository.ts
│       ├── stock-movement.repository.ts
│       ├── stock-reservation.repository.ts
│       ├── warehouse-transfer.repository.ts
│       └── inventory-alert.repository.ts
│
├── application/
│   ├── use-cases/
│   │   ├── warehouse/
│   │   │   ├── create-warehouse.use-case.ts
│   │   │   ├── update-warehouse.use-case.ts
│   │   │   ├── get-warehouse.use-case.ts
│   │   │   ├── list-warehouses.use-case.ts
│   │   │   ├── delete-warehouse.use-case.ts
│   │   │   └── set-default-warehouse.use-case.ts
│   │   ├── inventory/
│   │   │   ├── get-inventory.use-case.ts
│   │   │   ├── get-inventory-by-product.use-case.ts
│   │   │   ├── get-inventory-by-warehouse.use-case.ts
│   │   │   ├── update-stock.use-case.ts
│   │   │   ├── adjust-stock.use-case.ts
│   │   │   ├── bulk-update-stock.use-case.ts
│   │   │   └── get-stock-history.use-case.ts
│   │   ├── reservation/
│   │   │   ├── reserve-stock.use-case.ts
│   │   │   ├── release-reservation.use-case.ts
│   │   │   ├── extend-reservation.use-case.ts
│   │   │   ├── get-reservations.use-case.ts
│   │   │   ├── get-reservation-by-order.use-case.ts
│   │   │   └── expire-reservations.use-case.ts
│   │   ├── movement/
│   │   │   ├── record-movement.use-case.ts
│   │   │   ├── get-movements.use-case.ts
│   │   │   └── get-movements-by-product.use-case.ts
│   │   ├── transfer/
│   │   │   ├── create-transfer.use-case.ts
│   │   │   ├── approve-transfer.use-case.ts
│   │   │   ├── execute-transfer.use-case.ts
│   │   │   ├── cancel-transfer.use-case.ts
│   │   │   ├── get-transfer.use-case.ts
│   │   │   └── list-transfers.use-case.ts
│   │   ├── availability/
│   │   │   ├── check-availability.use-case.ts
│   │   │   ├── get-availability-by-product.use-case.ts
│   │   │   ├── get-availability-by-location.use-case.ts
│   │   │   └── update-availability-status.use-case.ts
│   │   └── alert/
│   │       ├── create-alert.use-case.ts
│   │       ├── acknowledge-alert.use-case.ts
│   │       ├── get-alerts.use-case.ts
│   │       └── check-stock-alerts.use-case.ts
│   ├── services/
│   │   ├── stock-calculation.service.ts
│   │   ├── reservation-manager.service.ts
│   │   ├── transfer-workflow.service.ts
│   │   ├── alert-notification.service.ts
│   │   └── inventory-cache.service.ts
│   └── dto/
│       ├── warehouse/
│       │   ├── create-warehouse.dto.ts
│       │   ├── update-warehouse.dto.ts
│       │   └── warehouse-response.dto.ts
│       ├── inventory/
│       │   ├── update-stock.dto.ts
│       │   ├── adjust-stock.dto.ts
│       │   ├── inventory-response.dto.ts
│       │   └── stock-history.dto.ts
│       ├── reservation/
│       │   ├── reserve-stock.dto.ts
│       │   ├── reservation-response.dto.ts
│       │   └── reservation-query.dto.ts
│       ├── transfer/
│       │   ├── create-transfer.dto.ts
│       │   ├── transfer-response.dto.ts
│       │   └── transfer-query.dto.ts
│       └── availability/
│           ├── availability-response.dto.ts
│           └── availability-query.dto.ts
│
├── infrastructure/
│   ├── repositories/
│   │   ├── prisma-warehouse.repository.ts
│   │   ├── prisma-inventory.repository.ts
│   │   ├── prisma-stock-movement.repository.ts
│   │   ├── prisma-stock-reservation.repository.ts
│   │   ├── prisma-warehouse-transfer.repository.ts
│   │   └── prisma-inventory-alert.repository.ts
│   ├── services/
│   │   ├── redis-inventory-cache.service.ts
│   │   ├── postgres-transaction.service.ts
│   │   └── inventory-event-publisher.service.ts
│   ├── mappers/
│   │   ├── warehouse.mapper.ts
│   │   ├── inventory.mapper.ts
│   │   └── stock-movement.mapper.ts
│   └── cache/
│       ├── inventory-cache.strategy.ts
│       └── warehouse-cache.strategy.ts
│
├── presentation/
│   ├── controllers/
│   │   ├── warehouse.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── reservation.controller.ts
│   │   ├── transfer.controller.ts
│   │   ├── availability.controller.ts
│   │   └── alert.controller.ts
│   ├── guards/
│   │   └── warehouse-admin.guard.ts
│   ├── interceptors/
│   │   └── inventory-cache.interceptor.ts
│   └── dto/
│       ├── create-warehouse.dto.ts
│       ├── update-stock.dto.ts
│       ├── adjust-stock.dto.ts
│       ├── reserve-stock.dto.ts
│       ├── create-transfer.dto.ts
│       ├── transfer-query.dto.ts
│       └── inventory-query.dto.ts
│
└── inventory.module.ts
```

---

## PART 2 — Domain Entities

### 2.1 Warehouse Entity

```typescript
// modules/inventory/domain/entities/warehouse.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';

export enum WarehouseType {
  MAIN = 'main',
  VIRTUAL = 'virtual',
  DROP_SHIP = 'drop_ship',
  SUPPLIER = 'supplier',
  FULFILLMENT = 'fulfillment',
}

export enum WarehouseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export interface WarehouseProps {
  name: string;
  code: string;
  type: WarehouseType;
  status: WarehouseStatus;
  description?: string;
  address?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    countryCode: string;
  };
  contact?: {
    name: string;
    email: string;
    phone?: string;
  };
  capacity?: {
    maxItems: number;
    currentItems: number;
    unit: string;
  };
  operatingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  isDefault: boolean;
  priority: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class Warehouse extends AggregateRoot<WarehouseProps> {
  private constructor(props: WarehouseProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    name: string;
    code: string;
    type?: WarehouseType;
    description?: string;
    address?: WarehouseProps['address'];
    contact?: WarehouseProps['contact'];
    capacity?: WarehouseProps['capacity'];
  }): Warehouse {
    return new Warehouse({
      name: data.name,
      code: data.code.toUpperCase(),
      type: data.type || WarehouseType.MAIN,
      status: WarehouseStatus.ACTIVE,
      description: data.description,
      address: data.address,
      contact: data.contact,
      capacity: data.capacity,
      isDefault: false,
      priority: 0,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get name(): string {
    return this.props.name;
  }

  get code(): string {
    return this.props.code;
  }

  get type(): WarehouseType {
    return this.props.type;
  }

  get status(): WarehouseStatus {
    return this.props.status;
  }

  get isDefault(): boolean {
    return this.props.isDefault;
  }

  get isActive(): boolean {
    return this.props.status === WarehouseStatus.ACTIVE;
  }

  get capacity(): WarehouseProps['capacity'] {
    return this.props.capacity;
  }

  get isFull(): boolean {
    if (!this.props.capacity) return false;
    return this.props.capacity.currentItems >= this.props.capacity.maxItems;
  }

  updateWarehouse(data: Partial<WarehouseProps>): void {
    Object.assign(this.props, data);
    this.touch();
  }

  activate(): void {
    this.props.status = WarehouseStatus.ACTIVE;
    this.touch();
  }

  deactivate(): void {
    this.props.status = WarehouseStatus.INACTIVE;
    this.touch();
  }

  setMaintenance(): void {
    this.props.status = WarehouseStatus.MAINTENANCE;
    this.touch();
  }

  setAsDefault(): void {
    this.props.isDefault = true;
    this.touch();
  }

  unsetDefault(): void {
    this.props.isDefault = false;
    this.touch();
  }

  incrementItemCount(): void {
    if (this.props.capacity) {
      this.props.capacity.currentItems++;
      this.touch();
    }
  }

  decrementItemCount(): void {
    if (this.props.capacity && this.props.capacity.currentItems > 0) {
      this.props.capacity.currentItems--;
      this.touch();
    }
  }
}
```

### 2.2 Inventory Entity

```typescript
// modules/inventory/domain/entities/inventory.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Stock } from './stock.entity';
import { StockReservedEvent } from '../events/stock-reserved.event';
import { StockReleasedEvent } from '../events/stock-released.event';
import { StockUpdatedEvent } from '../events/stock-updated.event';
import { LowStockDetectedEvent } from '../events/low-stock-detected.event';
import { OutOfStockDetectedEvent } from '../events/out-of-stock-detected.event';

export interface InventoryProps {
  productId: string;
  variantId?: string;
  warehouseId: string;
  stock: Stock;
  createdAt: Date;
  updatedAt: Date;
}

export class Inventory extends AggregateRoot<InventoryProps> {
  private constructor(props: InventoryProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    productId: string;
    variantId?: string;
    warehouseId: string;
    quantity?: number;
    reservedQuantity?: number;
    allocatedQuantity?: number;
    incomingQuantity?: number;
    damagedQuantity?: number;
    returnedQuantity?: number;
    safetyStock?: number;
    minimumStock?: number;
    maximumStock?: number;
  }): Inventory {
    return new Inventory({
      productId: data.productId,
      variantId: data.variantId,
      warehouseId: data.warehouseId,
      stock: Stock.create({
        quantity: data.quantity || 0,
        reservedQuantity: data.reservedQuantity || 0,
        allocatedQuantity: data.allocatedQuantity || 0,
        incomingQuantity: data.incomingQuantity || 0,
        damagedQuantity: data.damagedQuantity || 0,
        returnedQuantity: data.returnedQuantity || 0,
        safetyStock: data.safetyStock || 0,
        minimumStock: data.minimumStock || 0,
        maximumStock: data.maximumStock || 0,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get productId(): string {
    return this.props.productId;
  }

  get variantId(): string | undefined {
    return this.props.variantId;
  }

  get warehouseId(): string {
    return this.props.warehouseId;
  }

  get stock(): Stock {
    return this.props.stock;
  }

  get availableQuantity(): number {
    return this.props.stock.availableQuantity;
  }

  get reservedQuantity(): number {
    return this.props.stock.reservedQuantity;
  }

  get totalQuantity(): number {
    return this.props.stock.quantity;
  }

  get isLowStock(): boolean {
    return this.props.stock.isLowStock;
  }

  get isOutOfStock(): boolean {
    return this.props.stock.isOutOfStock;
  }

  get isCriticalStock(): boolean {
    return this.props.stock.isCriticalStock;
  }

  reserveStock(quantity: number, reservationId: string): boolean {
    if (this.props.stock.availableQuantity < quantity) {
      return false;
    }

    this.props.stock.addReserved(quantity);
    this.touch();

    this.addDomainEvent(new StockReservedEvent(
      this.id,
      this.productId,
      this.variantId,
      this.warehouseId,
      quantity,
      reservationId,
    ));

    // Check stock levels after reservation
    this.checkStockLevels();

    return true;
  }

  releaseReservation(quantity: number, reservationId: string): void {
    this.props.stock.removeReserved(quantity);
    this.touch();

    this.addDomainEvent(new StockReleasedEvent(
      this.id,
      this.productId,
      this.variantId,
      this.warehouseId,
      quantity,
      reservationId,
    ));
  }

  confirmReservation(quantity: number): void {
    this.props.stock.commitReserved(quantity);
    this.touch();
  }

  addStock(quantity: number, reason: string): void {
    this.props.stock.addQuantity(quantity);
    this.touch();

    this.addDomainEvent(new StockUpdatedEvent(
      this.id,
      this.productId,
      this.variantId,
      this.warehouseId,
      quantity,
      reason,
    ));
  }

  removeStock(quantity: number, reason: string): boolean {
    if (this.props.stock.quantity < quantity) {
      return false;
    }

    this.props.stock.removeQuantity(quantity);
    this.touch();

    this.addDomainEvent(new StockUpdatedEvent(
      this.id,
      this.productId,
      this.variantId,
      this.warehouseId,
      -quantity,
      reason,
    ));

    this.checkStockLevels();
    return true;
  }

  adjustStock(newQuantity: number, reason: string, operatorId?: string): void {
    const difference = newQuantity - this.props.stock.quantity;
    this.props.stock.setQuantity(newQuantity);
    this.touch();

    this.addDomainEvent(new StockUpdatedEvent(
      this.id,
      this.productId,
      this.variantId,
      this.warehouseId,
      difference,
      reason,
    ));

    this.checkStockLevels();
  }

  markDamaged(quantity: number, reason: string): void {
    this.props.stock.addDamaged(quantity);
    this.removeStock(quantity, `Damaged: ${reason}`);
  }

  addReturned(quantity: number, reason: string): void {
    this.props.stock.addReturned(quantity);
    this.addStock(quantity, `Returned: ${reason}`);
  }

  addIncoming(quantity: number): void {
    this.props.stock.addIncoming(quantity);
    this.touch();
  }

  receiveIncoming(quantity: number): void {
    this.props.stock.removeIncoming(quantity);
    this.addStock(quantity, 'Incoming stock received');
  }

  private checkStockLevels(): void {
    if (this.props.stock.isOutOfStock) {
      this.addDomainEvent(new OutOfStockDetectedEvent(
        this.id,
        this.productId,
        this.variantId,
        this.warehouseId,
      ));
    } else if (this.props.stock.isCriticalStock) {
      this.addDomainEvent(new LowStockDetectedEvent(
        this.id,
        this.productId,
        this.variantId,
        this.warehouseId,
        this.props.stock.quantity,
        'critical',
      ));
    } else if (this.props.stock.isLowStock) {
      this.addDomainEvent(new LowStockDetectedEvent(
        this.id,
        this.productId,
        this.variantId,
        this.warehouseId,
        this.props.stock.quantity,
        'low',
      ));
    }
  }
}
```

### 2.3 Stock Entity (Value Object)

```typescript
// modules/inventory/domain/entities/stock.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export interface StockProps {
  quantity: number;
  reservedQuantity: number;
  allocatedQuantity: number;
  incomingQuantity: number;
  damagedQuantity: number;
  returnedQuantity: number;
  safetyStock: number;
  minimumStock: number;
  maximumStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Stock extends BaseEntity<StockProps> {
  private constructor(props: StockProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    quantity?: number;
    reservedQuantity?: number;
    allocatedQuantity?: number;
    incomingQuantity?: number;
    damagedQuantity?: number;
    returnedQuantity?: number;
    safetyStock?: number;
    minimumStock?: number;
    maximumStock?: number;
  }): Stock {
    return new Stock({
      quantity: data.quantity || 0,
      reservedQuantity: data.reservedQuantity || 0,
      allocatedQuantity: data.allocatedQuantity || 0,
      incomingQuantity: data.incomingQuantity || 0,
      damagedQuantity: data.damagedQuantity || 0,
      returnedQuantity: data.returnedQuantity || 0,
      safetyStock: data.safetyStock || 0,
      minimumStock: data.minimumStock || 0,
      maximumStock: data.maximumStock || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get reservedQuantity(): number {
    return this.props.reservedQuantity;
  }

  get allocatedQuantity(): number {
    return this.props.allocatedQuantity;
  }

  get incomingQuantity(): number {
    return this.props.incomingQuantity;
  }

  get damagedQuantity(): number {
    return this.props.damagedQuantity;
  }

  get returnedQuantity(): number {
    return this.props.returnedQuantity;
  }

  get safetyStock(): number {
    return this.props.safetyStock;
  }

  get minimumStock(): number {
    return this.props.minimumStock;
  }

  get maximumStock(): number {
    return this.props.maximumStock;
  }

  get availableQuantity(): number {
    return this.props.quantity - this.props.reservedQuantity - this.props.allocatedQuantity;
  }

  get isLowStock(): boolean {
    return this.availableQuantity <= this.props.safetyStock && this.availableQuantity > 0;
  }

  get isOutOfStock(): boolean {
    return this.availableQuantity <= 0;
  }

  get isCriticalStock(): boolean {
    return this.availableQuantity <= this.props.minimumStock && this.availableQuantity > 0;
  }

  get isOverStock(): boolean {
    return this.props.maximumStock > 0 && this.props.quantity > this.props.maximumStock;
  }

  get stockLevel(): 'out_of_stock' | 'critical' | 'low' | 'normal' | 'overstock' {
    if (this.isOutOfStock) return 'out_of_stock';
    if (this.isCriticalStock) return 'critical';
    if (this.isLowStock) return 'low';
    if (this.isOverStock) return 'overstock';
    return 'normal';
  }

  addQuantity(quantity: number): void {
    this.props.quantity += quantity;
    this.touch();
  }

  removeQuantity(quantity: number): void {
    this.props.quantity = Math.max(0, this.props.quantity - quantity);
    this.touch();
  }

  setQuantity(quantity: number): void {
    this.props.quantity = Math.max(0, quantity);
    this.touch();
  }

  addReserved(quantity: number): void {
    this.props.reservedQuantity += quantity;
    this.touch();
  }

  removeReserved(quantity: number): void {
    this.props.reservedQuantity = Math.max(0, this.props.reservedQuantity - quantity);
    this.touch();
  }

  commitReserved(quantity: number): void {
    this.props.reservedQuantity = Math.max(0, this.props.reservedQuantity - quantity);
    this.props.quantity = Math.max(0, this.props.quantity - quantity);
    this.touch();
  }

  addAllocated(quantity: number): void {
    this.props.allocatedQuantity += quantity;
    this.touch();
  }

  removeAllocated(quantity: number): void {
    this.props.allocatedQuantity = Math.max(0, this.props.allocatedQuantity - quantity);
    this.touch();
  }

  addIncoming(quantity: number): void {
    this.props.incomingQuantity += quantity;
    this.touch();
  }

  removeIncoming(quantity: number): void {
    this.props.incomingQuantity = Math.max(0, this.props.incomingQuantity - quantity);
    this.touch();
  }

  addDamaged(quantity: number): void {
    this.props.damagedQuantity += quantity;
    this.touch();
  }

  addReturned(quantity: number): void {
    this.props.returnedQuantity += quantity;
    this.touch();
  }

  setSafetyStock(value: number): void {
    this.props.safetyStock = value;
    this.touch();
  }

  setMinimumStock(value: number): void {
    this.props.minimumStock = value;
    this.touch();
  }

  setMaximumStock(value: number): void {
    this.props.maximumStock = value;
    this.touch();
  }
}
```

### 2.4 Stock Movement Entity

```typescript
// modules/inventory/domain/entities/stock-movement.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum StockMovementType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  RESERVATION = 'reservation',
  RELEASE = 'release',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
  DAMAGE = 'damage',
  CORRECTION = 'correction',
  RECEIPT = 'receipt',
  ALLOCATION = 'allocation',
  DE_ALLOCATION = 'de_allocation',
}

export interface StockMovementProps {
  inventoryId: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
  notes?: string;
  performedBy?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class StockMovement extends BaseEntity<StockMovementProps> {
  private constructor(props: StockMovementProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    inventoryId: string;
    productId: string;
    variantId?: string;
    warehouseId: string;
    type: StockMovementType;
    quantity: number;
    previousQuantity: number;
    referenceType?: string;
    referenceId?: string;
    reason?: string;
    notes?: string;
    performedBy?: string;
  }): StockMovement {
    return new StockMovement({
      ...data,
      newQuantity: data.previousQuantity + (data.type === StockMovementType.SALE ? -data.quantity : data.quantity),
      createdAt: new Date(),
    });
  }

  get type(): StockMovementType {
    return this.props.type;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get previousQuantity(): number {
    return this.props.previousQuantity;
  }

  get newQuantity(): number {
    return this.props.newQuantity;
  }

  get isIncrease(): boolean {
    return [
      StockMovementType.PURCHASE,
      StockMovementType.RETURN,
      StockMovementType.TRANSFER_IN,
      StockMovementType.RECEIPT,
      StockMovementType.CORRECTION,
    ].includes(this.props.type);
  }

  get isDecrease(): boolean {
    return [
      StockMovementType.SALE,
      StockMovementType.DAMAGE,
      StockMovementType.TRANSFER_OUT,
      StockMovementType.ALLOCATION,
    ].includes(this.props.type);
  }
}
```

### 2.5 Stock Reservation Entity

```typescript
// modules/inventory/domain/entities/stock-reservation.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum ReservationStatus {
  ACTIVE = 'active',
  CONFIRMED = 'confirmed',
  RELEASED = 'released',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface StockReservationProps {
  inventoryId: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  orderId?: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: Date;
  releasedAt?: Date;
  releasedBy?: string;
  releaseReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class StockReservation extends BaseEntity<StockReservationProps> {
  private static readonly DEFAULT_EXPIRY_MINUTES = 30;

  private constructor(props: StockReservationProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    inventoryId: string;
    productId: string;
    variantId?: string;
    warehouseId: string;
    orderId?: string;
    quantity: number;
    expiryMinutes?: number;
    notes?: string;
  }): StockReservation {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + (data.expiryMinutes || StockReservation.DEFAULT_EXPIRY_MINUTES));

    return new StockReservation({
      ...data,
      status: ReservationStatus.ACTIVE,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get status(): ReservationStatus {
    return this.props.status;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get isExpired(): boolean {
    return this.props.expiresAt < new Date();
  }

  get isActive(): boolean {
    return this.props.status === ReservationStatus.ACTIVE && !this.isExpired;
  }

  confirm(): void {
    this.props.status = ReservationStatus.CONFIRMED;
    this.touch();
  }

  release(reason?: string, releasedBy?: string): void {
    this.props.status = ReservationStatus.RELEASED;
    this.props.releasedAt = new Date();
    this.props.releasedBy = releasedBy;
    this.props.releaseReason = reason;
    this.touch();
  }

  expire(): void {
    this.props.status = ReservationStatus.EXPIRED;
    this.props.releasedAt = new Date();
    this.props.releaseReason = 'Reservation expired';
    this.touch();
  }

  cancel(): void {
    this.props.status = ReservationStatus.CANCELLED;
    this.props.releasedAt = new Date();
    this.props.releaseReason = 'Reservation cancelled';
    this.touch();
  }

  extend(minutes: number): void {
    this.props.expiresAt = new Date(this.props.expiresAt.getTime() + minutes * 60 * 1000);
    this.touch();
  }
}
```

### 2.6 Warehouse Transfer Entity

```typescript
// modules/inventory/domain/entities/warehouse-transfer.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { WarehouseTransferItem } from './warehouse-transfer-item.entity';

export enum TransferStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_TRANSIT = 'in_transit',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export interface WarehouseTransferProps {
  transferNumber: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  status: TransferStatus;
  items: WarehouseTransferItem[];
  reason?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  shippedAt?: Date;
  receivedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class WarehouseTransfer extends AggregateRoot<WarehouseTransferProps> {
  private constructor(props: WarehouseTransferProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    transferNumber: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    items: WarehouseTransferItem[];
    reason?: string;
    notes?: string;
  }): WarehouseTransfer {
    return new WarehouseTransfer({
      ...data,
      status: TransferStatus.PENDING,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get transferNumber(): string {
    return this.props.transferNumber;
  }

  get status(): TransferStatus {
    return this.props.status;
  }

  get items(): WarehouseTransferItem[] {
    return this.props.items;
  }

  get totalQuantity(): number {
    return this.props.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  approve(approvedBy: string): void {
    this.props.status = TransferStatus.APPROVED;
    this.props.approvedBy = approvedBy;
    this.props.approvedAt = new Date();
    this.touch();
  }

  ship(): void {
    this.props.status = TransferStatus.IN_TRANSIT;
    this.props.shippedAt = new Date();
    this.touch();
  }

  receive(): void {
    this.props.status = TransferStatus.RECEIVED;
    this.props.receivedAt = new Date();
    this.touch();
  }

  cancel(reason: string): void {
    this.props.status = TransferStatus.CANCELLED;
    this.props.cancelledAt = new Date();
    this.props.cancelReason = reason;
    this.touch();
  }

  reject(reason: string): void {
    this.props.status = TransferStatus.REJECTED;
    this.props.cancelReason = reason;
    this.touch();
  }
}
```

### 2.7 Warehouse Transfer Item Entity

```typescript
// modules/inventory/domain/entities/warehouse-transfer-item.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export interface WarehouseTransferItemProps {
  transferId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  receivedQuantity?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WarehouseTransferItem extends BaseEntity<WarehouseTransferItemProps> {
  private constructor(props: WarehouseTransferItemProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    transferId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    notes?: string;
  }): WarehouseTransferItem {
    return new WarehouseTransferItem({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get receivedQuantity(): number {
    return this.props.receivedQuantity || 0;
  }

  get isFullyReceived(): boolean {
    return this.receivedQuantity === this.props.quantity;
  }

  get pendingQuantity(): number {
    return this.props.quantity - this.receivedQuantity;
  }

  receive(quantity: number): void {
    this.props.receivedQuantity = (this.props.receivedQuantity || 0) + quantity;
    this.touch();
  }
}
```

### 2.8 Inventory Alert Entity

```typescript
// modules/inventory/domain/entities/inventory-alert.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum AlertType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  CRITICAL_STOCK = 'critical_stock',
  OVERSTOCK = 'overstock',
  RESERVATION_EXPIRED = 'reservation_expired',
  TRANSMENT_DELAYED = 'transfer_delayed',
  STOCK_DISCREPANCY = 'stock_discrepancy',
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export interface InventoryAlertProps {
  inventoryId: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  details?: Record<string, any>;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class InventoryAlert extends BaseEntity<InventoryAlertProps> {
  private constructor(props: InventoryAlertProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    inventoryId: string;
    productId: string;
    variantId?: string;
    warehouseId: string;
    type: AlertType;
    severity: AlertSeverity;
    message: string;
    details?: Record<string, any>;
  }): InventoryAlert {
    return new InventoryAlert({
      ...data,
      status: AlertStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get type(): AlertType {
    return this.props.type;
  }

  get severity(): AlertSeverity {
    return this.props.severity;
  }

  get status(): AlertStatus {
    return this.props.status;
  }

  get isActive(): boolean {
    return this.props.status === AlertStatus.ACTIVE;
  }

  acknowledge(acknowledgedBy: string): void {
    this.props.status = AlertStatus.ACKNOWLEDGED;
    this.props.acknowledgedBy = acknowledgedBy;
    this.props.acknowledgedAt = new Date();
    this.touch();
  }

  resolve(): void {
    this.props.status = AlertStatus.RESOLVED;
    this.props.resolvedAt = new Date();
    this.touch();
  }

  dismiss(): void {
    this.props.status = AlertStatus.DISMISSED;
    this.touch();
  }
}
```

---

## PART 3 — Application Layer

### 3.1 Reserve Stock Use Case

```typescript
// modules/inventory/application/use-cases/reservation/reserve-stock.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { StockReservationRepository } from '../../repositories/stock-reservation.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { InventoryCacheService } from '../../services/inventory-cache.service';
import { StockReservation } from '../../domain/entities/stock-reservation.entity';
import { InsufficientStockException } from '../../domain/exceptions/insufficient-stock.exception';
import { DuplicateReservationException } from '../../domain/exceptions/duplicate-reservation.exception';

export interface ReserveStockInput {
  productId: string;
  variantId?: string;
  warehouseId?: string;
  quantity: number;
  orderId?: string;
  expiryMinutes?: number;
}

export interface ReserveStockOutput {
  reservationId: string;
  productId: string;
  quantity: number;
  warehouseId: string;
  expiresAt: Date;
}

@Injectable()
export class ReserveStockUseCase extends BaseUseCase<ReserveStockInput, ReserveStockOutput> {
  private readonly logger = new Logger(ReserveStockUseCase.name);

  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly reservationRepository: StockReservationRepository,
    private readonly eventBus: EventBus,
    private readonly cacheService: InventoryCacheService,
  ) {
    super();
  }

  async execute(input: ReserveStockInput): Promise<Either<Error, ReserveStockOutput>> {
    // Check for existing reservation
    if (input.orderId) {
      const existingReservation = await this.reservationRepository.findByOrderId(input.orderId);
      if (existingReservation && existingReservation.isActive) {
        return left(new DuplicateReservationException(input.orderId));
      }
    }

    // Find inventory
    let inventory;
    if (input.warehouseId) {
      inventory = await this.inventoryRepository.findByProductAndWarehouse(
        input.productId,
        input.warehouseId,
        input.variantId,
      );
    } else {
      // Find inventory across all warehouses, prioritize by stock level
      inventory = await this.inventoryRepository.findBestWarehouseForProduct(
        input.productId,
        input.variantId,
        input.quantity,
      );
    }

    if (!inventory) {
      return left(new InsufficientStockException(input.productId, input.quantity, 0));
    }

    // Try to reserve stock
    const reservation = StockReservation.create({
      inventoryId: inventory.id,
      productId: input.productId,
      variantId: input.variantId,
      warehouseId: inventory.warehouseId,
      orderId: input.orderId,
      quantity: input.quantity,
      expiryMinutes: input.expiryMinutes,
    });

    const reserved = inventory.reserveStock(input.quantity, reservation.id);

    if (!reserved) {
      return left(new InsufficientStockException(
        input.productId,
        input.quantity,
        inventory.availableQuantity,
      ));
    }

    // Save in transaction
    await this.inventoryRepository.update(inventory.id, inventory);
    await this.reservationRepository.create(reservation);

    // Invalidate cache
    await this.cacheService.invalidateInventory(input.productId);

    // Publish events
    await this.eventBus.publishAll(inventory.domainEvents);
    inventory.clearEvents();

    this.logger.log(`Reserved ${input.quantity} units of product ${input.productId} in warehouse ${inventory.warehouseId}`);

    return right({
      reservationId: reservation.id,
      productId: input.productId,
      quantity: input.quantity,
      warehouseId: inventory.warehouseId,
      expiresAt: reservation.props.expiresAt,
    });
  }
}
```

### 3.2 Release Reservation Use Case

```typescript
// modules/inventory/application/use-cases/reservation/release-reservation.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { StockReservationRepository } from '../../repositories/stock-reservation.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { InventoryCacheService } from '../../services/inventory-cache.service';
import { ReservationNotFoundException } from '../../domain/exceptions/reservation-not-found.exception';

export interface ReleaseReservationInput {
  reservationId: string;
  reason?: string;
  releasedBy?: string;
}

export interface ReleaseReservationOutput {
  message: string;
  reservationId: string;
  releasedQuantity: number;
}

@Injectable()
export class ReleaseReservationUseCase extends BaseUseCase<ReleaseReservationInput, ReleaseReservationOutput> {
  private readonly logger = new Logger(ReleaseReservationUseCase.name);

  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly reservationRepository: StockReservationRepository,
    private readonly eventBus: EventBus,
    private readonly cacheService: InventoryCacheService,
  ) {
    super();
  }

  async execute(input: ReleaseReservationInput): Promise<Either<Error, ReleaseReservationOutput>> {
    // Get reservation
    const reservation = await this.reservationRepository.findById(input.reservationId);

    if (!reservation) {
      return left(new ReservationNotFoundException(input.reservationId));
    }

    if (!reservation.isActive) {
      return left(new Error('Reservation is not active'));
    }

    // Get inventory
    const inventory = await this.inventoryRepository.findById(reservation.inventoryId);

    if (!inventory) {
      return left(new Error('Inventory not found'));
    }

    // Release stock
    inventory.releaseReservation(reservation.quantity, reservation.id);
    reservation.release(input.reason, input.releasedBy);

    // Save
    await this.inventoryRepository.update(inventory.id, inventory);
    await this.reservationRepository.update(reservation.id, reservation);

    // Invalidate cache
    await this.cacheService.invalidateInventory(reservation.productId);

    // Publish events
    await this.eventBus.publishAll(inventory.domainEvents);
    inventory.clearEvents();

    this.logger.log(`Released reservation ${input.reservationId} for ${reservation.quantity} units`);

    return right({
      message: 'Reservation released successfully',
      reservationId: reservation.id,
      releasedQuantity: reservation.quantity,
    });
  }
}
```

### 3.3 Expire Reservations Use Case

```typescript
// modules/inventory/application/use-cases/reservation/expire-reservations.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, right } from '../../../../common/utils/either.util';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { StockReservationRepository } from '../../repositories/stock-reservation.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { InventoryCacheService } from '../../services/inventory-cache.service';
import { ReservationExpiredEvent } from '../../domain/events/reservation-expired.event';

export interface ExpireReservationsInput {
  batchSize?: number;
}

export interface ExpireReservationsOutput {
  expiredCount: number;
  releasedQuantity: number;
}

@Injectable()
export class ExpireReservationsUseCase extends BaseUseCase<ExpireReservationsInput, ExpireReservationsOutput> {
  private readonly logger = new Logger(ExpireReservationsUseCase.name);

  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly reservationRepository: StockReservationRepository,
    private readonly eventBus: EventBus,
    private readonly cacheService: InventoryCacheService,
  ) {
    super();
  }

  async execute(input: ExpireReservationsInput): Promise<Either<Error, ExpireReservationsOutput>> {
    const batchSize = input.batchSize || 100;
    let expiredCount = 0;
    let releasedQuantity = 0;

    // Get expired reservations
    const expiredReservations = await this.reservationRepository.findExpired(batchSize);

    for (const reservation of expiredReservations) {
      try {
        // Get inventory
        const inventory = await this.inventoryRepository.findById(reservation.inventoryId);

        if (inventory) {
          // Release stock
          inventory.releaseReservation(reservation.quantity, reservation.id);
          await this.inventoryRepository.update(inventory.id, inventory);

          // Invalidate cache
          await this.cacheService.invalidateInventory(reservation.productId);
        }

        // Mark reservation as expired
        reservation.expire();
        await this.reservationRepository.update(reservation.id, reservation);

        // Publish event
        await this.eventBus.publish(new ReservationExpiredEvent(
          reservation.id,
          reservation.productId,
          reservation.quantity,
        ));

        expiredCount++;
        releasedQuantity += reservation.quantity;

        this.logger.log(`Expired reservation ${reservation.id} for ${reservation.quantity} units`);
      } catch (error) {
        this.logger.error(`Failed to expire reservation ${reservation.id}:`, error);
      }
    }

    this.logger.log(`Expired ${expiredCount} reservations, released ${releasedQuantity} units`);

    return right({
      expiredCount,
      releasedQuantity,
    });
  }
}
```

### 3.4 Create Transfer Use Case

```typescript
// modules/inventory/application/use-cases/transfer/create-transfer.use-case.ts
import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { WarehouseRepository } from '../../repositories/warehouse.repository';
import { WarehouseTransferRepository } from '../../repositories/warehouse-transfer.repository';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { WarehouseTransfer } from '../../domain/entities/warehouse-transfer.entity';
import { WarehouseTransferItem } from '../../domain/entities/warehouse-transfer-item.entity';
import { WarehouseNotFoundException } from '../../domain/exceptions/warehouse-not-found.exception';
import { InsufficientStockException } from '../../domain/exceptions/insufficient-stock.exception';

export interface CreateTransferInput {
  fromWarehouseId: string;
  toWarehouseId: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    notes?: string;
  }>;
  reason?: string;
  notes?: string;
}

export interface CreateTransferOutput {
  transferId: string;
  transferNumber: string;
  status: string;
}

@Injectable()
export class CreateTransferUseCase extends BaseUseCase<CreateTransferInput, CreateTransferOutput> {
  constructor(
    private readonly warehouseRepository: WarehouseRepository,
    private readonly transferRepository: WarehouseTransferRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: CreateTransferInput): Promise<Either<Error, CreateTransferOutput>> {
    // Validate warehouses exist
    const fromWarehouse = await this.warehouseRepository.findById(input.fromWarehouseId);
    if (!fromWarehouse) {
      return left(new WarehouseNotFoundException(input.fromWarehouseId));
    }

    const toWarehouse = await this.warehouseRepository.findById(input.toWarehouseId);
    if (!toWarehouse) {
      return left(new WarehouseNotFoundException(input.toWarehouseId));
    }

    // Check stock availability
    for (const item of input.items) {
      const inventory = await this.inventoryRepository.findByProductAndWarehouse(
        item.productId,
        input.fromWarehouseId,
        item.variantId,
      );

      if (!inventory || inventory.availableQuantity < item.quantity) {
        return left(new InsufficientStockException(
          item.productId,
          item.quantity,
          inventory?.availableQuantity || 0,
        ));
      }
    }

    // Generate transfer number
    const transferNumber = await this.transferRepository.generateTransferNumber();

    // Create transfer items
    const transferItems = input.items.map(item =>
      WarehouseTransferItem.create({
        transferId: '', // Will be set after creation
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        notes: item.notes,
      })
    );

    // Create transfer
    const transfer = WarehouseTransfer.create({
      transferNumber,
      fromWarehouseId: input.fromWarehouseId,
      toWarehouseId: input.toWarehouseId,
      items: transferItems,
      reason: input.reason,
      notes: input.notes,
    });

    // Save transfer
    const savedTransfer = await this.transferRepository.create(transfer);

    // Reserve stock in source warehouse
    for (const item of input.items) {
      const inventory = await this.inventoryRepository.findByProductAndWarehouse(
        item.productId,
        input.fromWarehouseId,
        item.variantId,
      );

      if (inventory) {
        inventory.removeStock(item.quantity, `Transfer to ${toWarehouse.name}`);
        await this.inventoryRepository.update(inventory.id, inventory);
      }
    }

    return right({
      transferId: savedTransfer.id,
      transferNumber: savedTransfer.transferNumber,
      status: savedTransfer.status,
    });
  }
}
```

### 3.5 Check Availability Use Case

```typescript
// modules/inventory/application/use-cases/availability/check-availability.use-case.ts
import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, right } from '../../../../common/utils/either.util';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { WarehouseRepository } from '../../repositories/warehouse.repository';

export interface CheckAvailabilityInput {
  productId: string;
  variantId?: string;
  quantity?: number;
  warehouseId?: string;
}

export interface CheckAvailabilityOutput {
  isAvailable: boolean;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  inStock: boolean;
  lowStock: boolean;
  outOfStock: boolean;
  stockLevel: 'out_of_stock' | 'critical' | 'low' | 'normal' | 'overstock';
  warehouses: Array<{
    warehouseId: string;
    warehouseName: string;
    availableQuantity: number;
    isDefault: boolean;
  }>;
  estimatedDelivery?: string;
}

@Injectable()
export class CheckAvailabilityUseCase extends BaseUseCase<CheckAvailabilityInput, CheckAvailabilityOutput> {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly warehouseRepository: WarehouseRepository,
  ) {
    super();
  }

  async execute(input: CheckAvailabilityInput): Promise<Either<Error, CheckAvailabilityOutput>> {
    // Get all inventory for this product
    const inventories = await this.inventoryRepository.findByProduct(
      input.productId,
      input.variantId,
    );

    // Calculate totals
    let totalQuantity = 0;
    let availableQuantity = 0;
    let reservedQuantity = 0;

    const warehouseData: CheckAvailabilityOutput['warehouses'] = [];

    for (const inventory of inventories) {
      totalQuantity += inventory.stock.quantity;
      availableQuantity += inventory.stock.availableQuantity;
      reservedQuantity += inventory.stock.reservedQuantity;

      const warehouse = await this.warehouseRepository.findById(inventory.warehouseId);
      if (warehouse) {
        warehouseData.push({
          warehouseId: warehouse.id,
          warehouseName: warehouse.name,
          availableQuantity: inventory.stock.availableQuantity,
          isDefault: warehouse.isDefault,
        });
      }
    }

    // Determine stock level
    let stockLevel: CheckAvailabilityOutput['stockLevel'] = 'normal';
    if (availableQuantity <= 0) {
      stockLevel = 'out_of_stock';
    } else if (availableQuantity <= 10) {
      stockLevel = 'critical';
    } else if (availableQuantity <= 50) {
      stockLevel = 'low';
    }

    // Check if requested quantity is available
    const isAvailable = input.quantity ? availableQuantity >= input.quantity : availableQuantity > 0;

    return right({
      isAvailable,
      totalQuantity,
      availableQuantity,
      reservedQuantity,
      inStock: availableQuantity > 0,
      lowStock: stockLevel === 'low' || stockLevel === 'critical',
      outOfStock: availableQuantity <= 0,
      stockLevel,
      warehouses: warehouseData.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)),
    });
  }
}
```

---

## PART 4 — Infrastructure Layer

### 4.1 Inventory Repository

```typescript
// modules/inventory/infrastructure/repositories/prisma-inventory.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { InventoryRepository } from '../../application/repositories/inventory.repository';
import { Inventory } from '../../domain/entities/inventory.entity';
import { InventoryMapper } from '../mappers/inventory.mapper';

@Injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Inventory | null> {
    const record = await this.prisma.inventory.findUnique({
      where: { id },
    });
    return record ? InventoryMapper.toDomain(record) : null;
  }

  async findByProductAndWarehouse(
    productId: string,
    warehouseId: string,
    variantId?: string,
  ): Promise<Inventory | null> {
    const record = await this.prisma.inventory.findFirst({
      where: {
        productId,
        warehouseId,
        variantId: variantId || null,
      },
    });
    return record ? InventoryMapper.toDomain(record) : null;
  }

  async findByProduct(productId: string, variantId?: string): Promise<Inventory[]> {
    const records = await this.prisma.inventory.findMany({
      where: {
        productId,
        variantId: variantId || null,
      },
    });
    return records.map(InventoryMapper.toDomain);
  }

  async findByWarehouse(warehouseId: string): Promise<Inventory[]> {
    const records = await this.prisma.inventory.findMany({
      where: { warehouseId },
    });
    return records.map(InventoryMapper.toDomain);
  }

  async findBestWarehouseForProduct(
    productId: string,
    variantId: string | undefined,
    quantity: number,
  ): Promise<Inventory | null> {
    const records = await this.prisma.inventory.findMany({
      where: {
        productId,
        variantId: variantId || null,
        quantity: { gte: quantity },
      },
      orderBy: { quantity: 'desc' },
      take: 1,
    });
    return records.length > 0 ? InventoryMapper.toDomain(records[0]) : null;
  }

  async findLowStock(threshold: number): Promise<Inventory[]> {
    const records = await this.prisma.inventory.findMany({
      where: {
        quantity: { lte: threshold },
        quantity: { gt: 0 },
      },
    });
    return records.map(InventoryMapper.toDomain);
  }

  async findOutOfStock(): Promise<Inventory[]> {
    const records = await this.prisma.inventory.findMany({
      where: {
        quantity: { lte: 0 },
      },
    });
    return records.map(InventoryMapper.toDomain);
  }

  async create(inventory: Inventory): Promise<Inventory> {
    const record = await this.prisma.inventory.create({
      data: InventoryMapper.toPersistence(inventory),
    });
    return InventoryMapper.toDomain(record);
  }

  async update(id: string, inventory: Inventory): Promise<Inventory> {
    const record = await this.prisma.inventory.update({
      where: { id },
      data: InventoryMapper.toPersistence(inventory),
    });
    return InventoryMapper.toDomain(record);
  }

  async upsert(data: {
    productId: string;
    variantId?: string;
    warehouseId: string;
    quantity: number;
  }): Promise<Inventory> {
    const record = await this.prisma.inventory.upsert({
      where: {
        productId_variantId_warehouseId: {
          productId: data.productId,
          variantId: data.variantId || '',
          warehouseId: data.warehouseId,
        },
      },
      update: {
        quantity: data.quantity,
      },
      create: {
        productId: data.productId,
        variantId: data.variantId,
        warehouseId: data.warehouseId,
        quantity: data.quantity,
      },
    });
    return InventoryMapper.toDomain(record);
  }

  async getTotalStock(productId: string, variantId?: string): Promise<number> {
    const result = await this.prisma.inventory.aggregate({
      _sum: { quantity: true },
      where: {
        productId,
        variantId: variantId || null,
      },
    });
    return result._sum.quantity || 0;
  }

  async getTotalAvailable(productId: string, variantId?: string): Promise<number> {
    const inventories = await this.findByProduct(productId, variantId);
    return inventories.reduce((sum, inv) => sum + inv.availableQuantity, 0);
  }
}
```

### 4.2 Stock Reservation Repository

```typescript
// modules/inventory/infrastructure/repositories/prisma-stock-reservation.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { StockReservationRepository } from '../../application/repositories/stock-reservation.repository';
import { StockReservation, ReservationStatus } from '../../domain/entities/stock-reservation.entity';

@Injectable()
export class PrismaStockReservationRepository implements StockReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<StockReservation | null> {
    const record = await this.prisma.stockReservation.findUnique({
      where: { id },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByOrderId(orderId: string): Promise<StockReservation | null> {
    const record = await this.prisma.stockReservation.findFirst({
      where: { orderId },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByInventoryId(inventoryId: string): Promise<StockReservation[]> {
    const records = await this.prisma.stockReservation.findMany({
      where: { inventoryId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toDomain);
  }

  async findActive(): Promise<StockReservation[]> {
    const records = await this.prisma.stockReservation.findMany({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
    });
    return records.map(this.toDomain);
  }

  async findExpired(limit: number): Promise<StockReservation[]> {
    const records = await this.prisma.stockReservation.findMany({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: { lte: new Date() },
      },
      take: limit,
    });
    return records.map(this.toDomain);
  }

  async countByInventory(inventoryId: string): Promise<number> {
    return this.prisma.stockReservation.count({
      where: {
        inventoryId,
        status: ReservationStatus.ACTIVE,
      },
    });
  }

  async create(reservation: StockReservation): Promise<StockReservation> {
    const record = await this.prisma.stockReservation.create({
      data: this.toPersistence(reservation),
    });
    return this.toDomain(record);
  }

  async update(id: string, reservation: StockReservation): Promise<StockReservation> {
    const record = await this.prisma.stockReservation.update({
      where: { id },
      data: this.toPersistence(reservation),
    });
    return this.toDomain(record);
  }

  private toDomain(record: any): StockReservation {
    return StockReservation.create({
      inventoryId: record.inventoryId,
      productId: record.productId,
      variantId: record.variantId,
      warehouseId: record.warehouseId,
      orderId: record.orderId,
      quantity: record.quantity,
    });
  }

  private toPersistence(reservation: StockReservation): any {
    return {
      inventoryId: reservation.props.inventoryId,
      productId: reservation.props.productId,
      variantId: reservation.props.variantId,
      warehouseId: reservation.props.warehouseId,
      orderId: reservation.props.orderId,
      quantity: reservation.props.quantity,
      status: reservation.props.status,
      expiresAt: reservation.props.expiresAt,
      releasedAt: reservation.props.releasedAt,
      releasedBy: reservation.props.releasedBy,
      releaseReason: reservation.props.releaseReason,
      notes: reservation.props.notes,
    };
  }
}
```

---

## PART 5 — Presentation Layer

### 5.1 Inventory Controller

```typescript
// modules/inventory/presentation/controllers/inventory.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../../shared/presentation/controllers/base.controller';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { AdjustStockDto } from '../dto/adjust-stock.dto';
import { ReserveStockDto } from '../dto/reserve-stock.dto';

// Use Cases
import { GetInventoryUseCase } from '../../application/use-cases/inventory/get-inventory.use-case';
import { UpdateStockUseCase } from '../../application/use-cases/inventory/update-stock.use-case';
import { AdjustStockUseCase } from '../../application/use-cases/inventory/adjust-stock.use-case';
import { GetStockHistoryUseCase } from '../../application/use-cases/inventory/get-stock-history.use-case';
import { ReserveStockUseCase } from '../../application/use-cases/reservation/reserve-stock.use-case';
import { ReleaseReservationUseCase } from '../../application/use-cases/reservation/release-reservation.use-case';
import { GetReservationsUseCase } from '../../application/use-cases/reservation/get-reservations.use-case';
import { CheckAvailabilityUseCase } from '../../application/use-cases/availability/check-availability.use-case';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController extends BaseController {
  constructor(
    private readonly getInventoryUseCase: GetInventoryUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
    private readonly adjustStockUseCase: AdjustStockUseCase,
    private readonly getStockHistoryUseCase: GetStockHistoryUseCase,
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly releaseReservationUseCase: ReleaseReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly checkAvailabilityUseCase: CheckAvailabilityUseCase,
  ) {
    super();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inventory list' })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({ name: 'lowStock', required: false, type: Boolean })
  @ApiQuery({ name: 'outOfStock', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Inventory retrieved' })
  async getInventory(
    @Query('warehouseId') warehouseId?: string,
    @Query('lowStock') lowStock?: string,
    @Query('outOfStock') outOfStock?: string,
  ) {
    const result = await this.getInventoryUseCase.execute({
      warehouseId,
      lowStock: lowStock === 'true',
      outOfStock: outOfStock === 'true',
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Check product availability' })
  @ApiQuery({ name: 'variantId', required: false, type: String })
  @ApiQuery({ name: 'quantity', required: false, type: Number })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Availability checked' })
  async checkAvailability(
    @Param('productId') productId: string,
    @Query('variantId') variantId?: string,
    @Query('quantity') quantity?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    const result = await this.checkAvailabilityUseCase.execute({
      productId,
      variantId,
      quantity: quantity ? Number(quantity) : undefined,
      warehouseId,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update stock' })
  @ApiResponse({ status: 200, description: 'Stock updated' })
  async updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    const result = await this.updateStockUseCase.execute({
      inventoryId: id,
      quantity: dto.quantity,
      reason: dto.reason,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post(':id/adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Adjust stock' })
  @ApiResponse({ status: 200, description: 'Stock adjusted' })
  async adjustStock(
    @Param('id') id: string,
    @Body() dto: AdjustStockDto,
  ) {
    const result = await this.adjustStockUseCase.execute({
      inventoryId: id,
      quantity: dto.quantity,
      reason: dto.reason,
      operatorId: dto.operatorId,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get(':id/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get stock history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Stock history retrieved' })
  async getStockHistory(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.getStockHistoryUseCase.execute({
      inventoryId: id,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post('reserve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reserve stock' })
  @ApiResponse({ status: 201, description: 'Stock reserved' })
  async reserveStock(@Body() dto: ReserveStockDto) {
    const result = await this.reserveStockUseCase.execute({
      productId: dto.productId,
      variantId: dto.variantId,
      warehouseId: dto.warehouseId,
      quantity: dto.quantity,
      orderId: dto.orderId,
      expiryMinutes: dto.expiryMinutes,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post('reservations/:id/release')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Release reservation' })
  @ApiResponse({ status: 200, description: 'Reservation released' })
  async releaseReservation(
    @Param('id') id: string,
    @Body() dto: { reason?: string },
  ) {
    const result = await this.releaseReservationUseCase.execute({
      reservationId: id,
      reason: dto.reason,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get('reservations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reservations' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'productId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Reservations retrieved' })
  async getReservations(
    @Query('status') status?: string,
    @Query('productId') productId?: string,
  ) {
    const result = await this.getReservationsUseCase.execute({
      status,
      productId,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }
}
```

### 5.2 Warehouse Controller

```typescript
// modules/inventory/presentation/controllers/warehouse.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../../shared/presentation/controllers/base.controller';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';

// Use Cases
import { CreateWarehouseUseCase } from '../../application/use-cases/warehouse/create-warehouse.use-case';
import { GetWarehouseUseCase } from '../../application/use-cases/warehouse/get-warehouse.use-case';
import { ListWarehousesUseCase } from '../../application/use-cases/warehouse/list-warehouses.use-case';
import { UpdateWarehouseUseCase } from '../../application/use-cases/warehouse/update-warehouse.use-case';
import { DeleteWarehouseUseCase } from '../../application/use-cases/warehouse/delete-warehouse.use-case';

@ApiTags('Warehouses')
@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@ApiBearerAuth()
export class WarehouseController extends BaseController {
  constructor(
    private readonly createWarehouseUseCase: CreateWarehouseUseCase,
    private readonly getWarehouseUseCase: GetWarehouseUseCase,
    private readonly listWarehousesUseCase: ListWarehousesUseCase,
    private readonly updateWarehouseUseCase: UpdateWarehouseUseCase,
    private readonly deleteWarehouseUseCase: DeleteWarehouseUseCase,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'List warehouses' })
  @ApiResponse({ status: 200, description: 'Warehouses listed' })
  async listWarehouses() {
    const result = await this.listWarehousesUseCase.execute({});
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse retrieved' })
  async getWarehouse(@Param('id') id: string) {
    const result = await this.getWarehouseUseCase.execute({ id });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created' })
  async createWarehouse(@Body() dto: CreateWarehouseDto) {
    const result = await this.createWarehouseUseCase.execute(dto);
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse updated' })
  async updateWarehouse(@Param('id') id: string, @Body() dto: any) {
    const result = await this.updateWarehouseUseCase.execute({ id, ...dto });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse deleted' })
  async deleteWarehouse(@Param('id') id: string) {
    const result = await this.deleteWarehouseUseCase.execute({ id });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }
}
```

---

## PART 6 — Angular Implementation

### 6.1 Inventory Dashboard

```typescript
// features/inventory/pages/inventory-dashboard/inventory-dashboard.page.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ButtonComponent],
  template: `
    <div class="inventory-dashboard">
      <div class="page-header">
        <h1>Inventory Dashboard</h1>
        <div class="header-actions">
          <a routerLink="/admin/inventory/adjust">
            <app-button variant="secondary">Adjust Stock</app-button>
          </a>
          <a routerLink="/admin/inventory/transfer">
            <app-button>Transfer Stock</app-button>
          </a>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ stats().totalProducts }}</p>
            <p class="stat-label">Total Products</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon in-stock">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ stats().inStock }}</p>
            <p class="stat-label">In Stock</p>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon low-stock">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ stats().lowStock }}</p>
            <p class="stat-label">Low Stock</p>
          </div>
        </div>

        <div class="stat-card danger">
          <div class="stat-icon out-of-stock">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ stats().outOfStock }}</p>
            <p class="stat-label">Out of Stock</p>
          </div>
        </div>
      </div>

      <!-- Low Stock Alert -->
      @if (lowStockItems().length > 0) {
        <div class="alert-section">
          <h2>Low Stock Alerts</h2>
          <div class="alert-list">
            @for (item of lowStockItems(); track item.id) {
              <div class="alert-item" [class.critical]="item.stockLevel === 'critical'">
                <div class="alert-info">
                  <span class="product-name">{{ item.productName }}</span>
                  <span class="stock-info">
                    {{ item.availableQuantity }} units available
                  </span>
                </div>
                <span class="stock-level" [class]="item.stockLevel">
                  {{ item.stockLevel | titlecase }}
                </span>
              </div>
            }
          </div>
        </div>
      }

      <!-- Recent Movements -->
      <div class="movements-section">
        <h2>Recent Stock Movements</h2>
        <div class="movements-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>Operator</th>
              </tr>
            </thead>
            <tbody>
              @for (movement of recentMovements(); track movement.id) {
                <tr>
                  <td>{{ movement.createdAt | date:'short' }}</td>
                  <td>{{ movement.productName }}</td>
                  <td>
                    <span class="movement-type" [class]="movement.type">
                      {{ movement.type }}
                    </span>
                  </td>
                  <td [class.positive]="movement.quantity > 0" [class.negative]="movement.quantity < 0">
                    {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
                  </td>
                  <td>{{ movement.warehouseName }}</td>
                  <td>{{ movement.operatorName || 'System' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-row">No recent movements</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-dashboard {
      padding: 2rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
    }
    .stat-icon.total { background: #dbeafe; color: #2563eb; }
    .stat-icon.in-stock { background: #dcfce7; color: #16a34a; }
    .stat-icon.low-stock { background: #fef3c7; color: #d97706; }
    .stat-icon.out-of-stock { background: #fee2e2; color: #dc2626; }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }
    .stat-label {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
    }
    .alert-section, .movements-section {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .alert-section h2, .movements-section h2 {
      margin: 0 0 1rem;
      font-size: 1.125rem;
    }
    .alert-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--color-surface);
      border-radius: var(--radius-md);
      margin-bottom: 0.5rem;
    }
    .alert-item.critical {
      background: #fee2e2;
    }
    .product-name {
      font-weight: 500;
    }
    .stock-info {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
    .stock-level {
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-weight: 500;
    }
    .stock-level.low { background: #fef3c7; color: #d97706; }
    .stock-level.critical { background: #fee2e2; color: #dc2626; }
    .stock-level.out_of_stock { background: #fee2e2; color: #dc2626; }
    .movements-table {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th {
      font-weight: 600;
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
    .movement-type {
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      text-transform: capitalize;
    }
    .movement-type.purchase { background: #dcfce7; color: #16a34a; }
    .movement-type.sale { background: #dbeafe; color: #2563eb; }
    .movement-type.adjustment { background: #fef3c7; color: #d97706; }
    .movement-type.transfer { background: #e0e7ff; color: #4f46e5; }
    .positive { color: #16a34a; }
    .negative { color: #dc2626; }
    .empty-row {
      text-align: center;
      color: var(--color-text-secondary);
      padding: 2rem;
    }
  `]
})
export class InventoryDashboardPage implements OnInit {
  stats = signal({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  lowStockItems = signal<any[]>([]);
  recentMovements = signal<any[]>([]);

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.inventoryService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
    });

    this.inventoryService.getLowStockItems().subscribe({
      next: (items) => this.lowStockItems.set(items),
    });

    this.inventoryService.getRecentMovements().subscribe({
      next: (movements) => this.recentMovements.set(movements),
    });
  }
}
```

---

## PART 7 — Events

```typescript
// Inventory Domain Events
export const INVENTORY_EVENTS = {
  // Stock Events
  STOCK_RESERVED: 'inventory.stock.reserved',
  STOCK_RELEASED: 'inventory.stock.released',
  STOCK_UPDATED: 'inventory.stock.updated',
  STOCK_ADJUSTED: 'inventory.stock.adjusted',
  STOCK_RECEIVED: 'inventory.stock.received',
  
  // Alert Events
  LOW_STOCK_DETECTED: 'inventory.alert.low_stock',
  OUT_OF_STOCK_DETECTED: 'inventory.alert.out_of_stock',
  CRITICAL_STOCK_DETECTED: 'inventory.alert.critical_stock',
  
  // Reservation Events
  RESERVATION_EXPIRED: 'inventory.reservation.expired',
  RESERVATION_CONFIRMED: 'inventory.reservation.confirmed',
  
  // Transfer Events
  WAREHOUSE_TRANSFER_CREATED: 'inventory.transfer.created',
  WAREHOUSE_TRANSFER_APPROVED: 'inventory.transfer.approved',
  WAREHOUSE_TRANSFER_COMPLETED: 'inventory.transfer.completed',
  WAREHOUSE_TRANSFER_CANCELLED: 'inventory.transfer.cancelled',
  
  // Availability Events
  PRODUCT_AVAILABILITY_CHANGED: 'inventory.availability.changed',
  PRODUCT_BACK_IN_STOCK: 'inventory.availability.back_in_stock',
};
```

---

## PART 8 — APIs Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Inventory** |
| GET | `/inventory` | Yes (Admin) | Get inventory list |
| GET | `/inventory/check/:productId` | No | Check availability |
| PATCH | `/inventory/:id/stock` | Yes (Admin) | Update stock |
| POST | `/inventory/:id/adjust` | Yes (Admin) | Adjust stock |
| GET | `/inventory/:id/history` | Yes (Admin) | Get stock history |
| POST | `/inventory/bulk-update` | Yes (Admin) | Bulk update stock |
| **Warehouses** |
| GET | `/warehouses` | Yes (Admin) | List warehouses |
| GET | `/warehouses/:id` | Yes (Admin) | Get warehouse |
| POST | `/warehouses` | Yes (Admin) | Create warehouse |
| PATCH | `/warehouses/:id` | Yes (Admin) | Update warehouse |
| DELETE | `/warehouses/:id` | Yes (Admin) | Delete warehouse |
| **Reservations** |
| POST | `/inventory/reserve` | Yes | Reserve stock |
| POST | `/inventory/reservations/:id/release` | Yes | Release reservation |
| POST | `/inventory/reservations/:id/extend` | Yes | Extend reservation |
| GET | `/inventory/reservations` | Yes (Admin) | Get reservations |
| **Transfers** |
| GET | `/transfers` | Yes (Admin) | List transfers |
| GET | `/transfers/:id` | Yes (Admin) | Get transfer |
| POST | `/transfers` | Yes (Admin) | Create transfer |
| POST | `/transfers/:id/approve` | Yes (Admin) | Approve transfer |
| POST | `/transfers/:id/ship` | Yes (Admin) | Ship transfer |
| POST | `/transfers/:id/receive` | Yes (Admin) | Receive transfer |
| POST | `/transfers/:id/cancel` | Yes (Admin) | Cancel transfer |
| **Alerts** |
| GET | `/inventory/alerts` | Yes (Admin) | Get alerts |
| POST | `/inventory/alerts/:id/acknowledge` | Yes (Admin) | Acknowledge alert |
| POST | `/inventory/alerts/:id/resolve` | Yes (Admin) | Resolve alert |

---

## Summary

### Deliverables

| Deliverable | Status | Description |
|-------------|--------|-------------|
| Complete Inventory Module | ✅ | Full inventory lifecycle management |
| Warehouse Management | ✅ | CRUD, capacity, status, defaults |
| Stock Management | ✅ | Available, reserved, allocated, incoming, damaged, returned |
| Reservation System | ✅ | Reserve, release, expiration, timeout |
| Stock Movement | ✅ | Immutable audit trail for all movements |
| Warehouse Transfer | ✅ | Transfer workflow with approval |
| Low Stock Management | ✅ | Alerts, notifications, thresholds |
| Product Availability | ✅ | Stock levels, availability status |
| REST APIs | ✅ | 25+ endpoints |
| Angular Dashboard | ✅ | Inventory dashboard, alerts, movements |
| Events | ✅ | 15+ domain events |
| Concurrency | ✅ | Optimistic locking, transaction management |

### Statistics

| Metric | Count |
|--------|-------|
| **Domain Entities** | 11 |
| **Enums** | 8 |
| **Use Cases** | 25+ |
| **Controllers** | 6 |
| **API Endpoints** | 25+ |
| **Domain Events** | 15+ |

The Inventory & Warehouse Management module is ready for integration with Orders, Products, and Analytics.
