# Payment & Financial Infrastructure Module

## Complete Enterprise Payment System

---

## PART 1 — Module Structure

### 1.1 Clean Architecture Layout

```
apps/api/src/modules/payment/
├── domain/
│   ├── entities/
│   │   ├── payment.entity.ts
│   │   ├── payment-method.entity.ts
│   │   ├── transaction.entity.ts
│   │   ├── refund.entity.ts
│   │   ├── wallet.entity.ts
│   │   ├── wallet-transaction.entity.ts
│   │   ├── payment-webhook.entity.ts
│   │   ├── payment-audit.entity.ts
│   │   └── payment-provider-config.entity.ts
│   ├── value-objects/
│   │   ├── money.vo.ts
│   │   ├── currency.vo.ts
│   │   ├── payment-reference.vo.ts
│   │   ├── idempotency-key.vo.ts
│   │   ├── gateway-response.vo.ts
│   │   └── webhook-signature.vo.ts
│   ├── enums/
│   │   ├── payment-status.enum.ts
│   │   ├── payment-method-type.enum.ts
│   │   ├── refund-status.enum.ts
│   │   ├── refund-type.enum.ts
│   │   ├── transaction-type.enum.ts
│   │   ├── transaction-status.enum.ts
│   │   ├── wallet-transaction-type.enum.ts
│   │   ├── payment-provider.enum.ts
│   │   └── webhook-status.enum.ts
│   ├── events/
│   │   ├── payment-initiated.event.ts
│   │   ├── payment-authorized.event.ts
│   │   ├── payment-captured.event.ts
│   │   ├── payment-succeeded.event.ts
│   │   ├── payment-failed.event.ts
│   │   ├── payment-cancelled.event.ts
│   │   ├── payment-expired.event.ts
│   │   ├── refund-requested.event.ts
│   │   ├── refund-completed.event.ts
│   │   ├── refund-failed.event.ts
│   │   ├── wallet-charged.event.ts
│   │   ├── wallet-debited.event.ts
│   │   ├── wallet-insufficient-funds.event.ts
│   │   ├── payment-dispute.event.ts
│   │   └── payment-retry.event.ts
│   ├── exceptions/
│   │   ├── payment-not-found.exception.ts
│   │   ├── payment-already-processed.exception.ts
│   │   ├── payment-amount-mismatch.exception.ts
│   │   ├── refund-amount-exceeds.exception.ts
│   │   ├── refund-not-allowed.exception.ts
│   │   ├── wallet-insufficient-funds.exception.ts
│   │   ├── wallet-not-found.exception.ts
│   │   ├── idempotency-key-conflict.exception.ts
│   │   ├── webhook-signature-invalid.exception.ts
│   │   ├── payment-provider-error.exception.ts
│   │   └── duplicate-webhook.exception.ts
│   └── repositories/
│       ├── payment.repository.ts
│       ├── payment-method.repository.ts
│       ├── transaction.repository.ts
│       ├── refund.repository.ts
│       ├── wallet.repository.ts
│       ├── wallet-transaction.repository.ts
│       ├── payment-webhook.repository.ts
│       └── payment-audit.repository.ts
│
├── infrastructure/
│   ├── providers/
│   │   ├── payment-provider.interface.ts
│   │   ├── payment-provider.factory.ts
│   │   ├── stripe/
│   │   │   ├── stripe.provider.ts
│   │   │   ├── stripe-webhook.handler.ts
│   │   │   └── stripe-mapper.ts
│   │   ├── paypal/
│   │   │   ├── paypal.provider.ts
│   │   │   ├── paypal-webhook.handler.ts
│   │   │   └── paypal-mapper.ts
│   │   ├── zarinpal/
│   │   │   ├── zarinpal.provider.ts
│   │   │   └── zarinpal-mapper.ts
│   │   └── custom/
│   │       ├── custom.provider.ts
│   │       └── custom-mapper.ts
│   ├── services/
│   │   ├── payment-provider.service.ts
│   │   ├── payment-webhook.service.ts
│   │   ├── payment-retry.service.ts
│   │   ├── payment-idempotency.service.ts
│   │   ├── payment-encryption.service.ts
│   │   └── payment-audit.service.ts
│   ├── repositories/
│   │   ├── prisma-payment.repository.ts
│   │   ├── prisma-payment-method.repository.ts
│   │   ├── prisma-transaction.repository.ts
│   │   ├── prisma-refund.repository.ts
│   │   ├── prisma-wallet.repository.ts
│   │   ├── prisma-wallet-transaction.repository.ts
│   │   ├── prisma-payment-webhook.repository.ts
│   │   └── prisma-payment-audit.repository.ts
│   ├── mappers/
│   │   ├── payment.mapper.ts
│   │   ├── transaction.mapper.ts
│   │   ├── refund.mapper.ts
│   │   └── wallet.mapper.ts
│   └── cache/
│       └── payment-cache.strategy.ts
│
├── application/
│   ├── use-cases/
│   │   ├── payment/
│   │   │   ├── create-payment.use-case.ts
│   │   │   ├── process-payment.use-case.ts
│   │   │   ├── verify-payment.use-case.ts
│   │   │   ├── get-payment.use-case.ts
│   │   │   ├── get-payment-by-reference.use-case.ts
│   │   │   ├── cancel-payment.use-case.ts
│   │   │   ├── retry-payment.use-case.ts
│   │   │   └── get-payment-history.use-case.ts
│   │   ├── refund/
│   │   │   ├── request-refund.use-case.ts
│   │   │   ├── process-refund.use-case.ts
│   │   │   ├── get-refund-status.use-case.ts
│   │   │   ├── get-refund-history.use-case.ts
│   │   │   └── validate-refund.use-case.ts
│   │   ├── wallet/
│   │   │   ├── get-wallet.use-case.ts
│   │   │   ├── get-wallet-balance.use-case.ts
│   │   │   ├── charge-wallet.use-case.ts
│   │   │   ├── credit-wallet.use-case.ts
│   │   │   ├── get-wallet-transactions.use-case.ts
│   │   │   └── transfer-wallet-funds.use-case.ts
│   │   ├── webhook/
│   │   │   ├── handle-webhook.use-case.ts
│   │   │   ├── verify-webhook-signature.use-case.ts
│   │   │   └── retry-failed-webhooks.use-case.ts
│   │   └── admin/
│   │       ├── get-payment-dashboard.use-case.ts
│   │       ├── get-transaction-history.use-case.ts
│   │       ├── export-payments.use-case.ts
│   │       └── reconcile-payments.use-case.ts
│   ├── services/
│   │   ├── payment-provider.service.ts
│   │   ├── payment-calculator.service.ts
│   │   ├── payment-validator.service.ts
│   │   └── payment-retry.service.ts
│   └── dto/
│       ├── payment/
│       │   ├── create-payment.dto.ts
│       │   ├── payment-response.dto.ts
│       │   └── payment-query.dto.ts
│       ├── refund/
│       │   ├── request-refund.dto.ts
│       │   └── refund-response.dto.ts
│       ├── wallet/
│       │   ├── wallet-response.dto.ts
│       │   ├── charge-wallet.dto.ts
│       │   └── wallet-transaction.dto.ts
│       └── webhook/
│           └── webhook-payload.dto.ts
│
├── presentation/
│   ├── controllers/
│   │   ├── payment.controller.ts
│   │   ├── refund.controller.ts
│   │   ├── wallet.controller.ts
│   │   ├── webhook.controller.ts
│   │   └── payment-admin.controller.ts
│   ├── guards/
│   │   └── webhook-signature.guard.ts
│   ├── interceptors/
│   │   ├── payment-idempotency.interceptor.ts
│   │   └── payment-audit.interceptor.ts
│   └── dto/
│       ├── create-payment.dto.ts
│       ├── request-refund.dto.ts
│       ├── charge-wallet.dto.ts
│       └── webhook-payload.dto.ts
│
└── payment.module.ts
```

---

## PART 2 — Domain Entities

### 2.1 Payment Provider Interface

```typescript
// modules/payment/infrastructure/providers/payment-provider.interface.ts
export interface PaymentProvider {
  readonly name: string;
  readonly code: string;

  // Payment operations
  createPayment(data: CreatePaymentRequest): Promise<PaymentResult>;
  authorizePayment(paymentId: string, amount: number): Promise<PaymentResult>;
  capturePayment(paymentId: string, amount?: number): Promise<PaymentResult>;
  cancelPayment(paymentId: string): Promise<PaymentResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatusResult>;

  // Refund operations
  refund(data: RefundRequest): Promise<RefundResult>;
  getRefundStatus(refundId: string): Promise<RefundStatusResult>;

  // Webhook verification
  verifyWebhookSignature(payload: string, signature: string): boolean;

  // Payment methods
  createPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethodResult>;
  deletePaymentMethod(paymentMethodId: string): Promise<void>;
  getPaymentMethods(customerId: string): Promise<PaymentMethodResult[]>;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerId?: string;
  email?: string;
  metadata?: Record<string, string>;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  status: string;
  clientSecret?: string;
  redirectUrl?: string;
  metadata?: Record<string, unknown>;
  error?: string;
  errorCode?: string;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason?: string;
  metadata?: Record<string, string>;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  status: string;
  amount: number;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface PaymentStatusResult {
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

export interface RefundStatusResult {
  status: string;
  amount: number;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentMethodRequest {
  customerId: string;
  type: string;
  token: string;
  metadata?: Record<string, string>;
}

export interface PaymentMethodResult {
  success: boolean;
  paymentMethodId: string;
  type: string;
  lastFour?: string;
  brand?: string;
  expiresAt?: Date;
  error?: string;
}
```

### 2.2 Payment Entity

```typescript
// modules/payment/domain/entities/payment.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Money } from '../value-objects/money.vo';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentInitiatedEvent } from '../events/payment-initiated.event';
import { PaymentSucceededEvent } from '../events/payment-succeeded.event';
import { PaymentFailedEvent } from '../events/payment-failed.event';
import { PaymentCancelledEvent } from '../events/payment-cancelled.event';

export interface PaymentProps {
  orderId: string;
  userId: string;
  status: PaymentStatus;
  amount: Money;
  currency: string;
  provider: string;
  providerPaymentId?: string;
  paymentMethod?: string;
  paymentMethodId?: string;
  description?: string;
  customerEmail?: string;
  customerId?: string;
  gatewayResponse?: Record<string, unknown>;
  gatewayMetadata?: Record<string, unknown>;
  idempotencyKey?: string;
  clientSecret?: string;
  redirectUrl?: string;
  returnUrl?: string;
  cancelUrl?: string;
  failureCode?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  metadata: Record<string, unknown>;
  authorizedAt?: Date;
  capturedAt?: Date;
  succeededAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot<PaymentProps> {
  private static readonly MAX_RETRY_COUNT = 3;

  private constructor(props: PaymentProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    provider: string;
    description?: string;
    customerEmail?: string;
    customerId?: string;
    paymentMethod?: string;
    paymentMethodId?: string;
    idempotencyKey?: string;
    returnUrl?: string;
    cancelUrl?: string;
    metadata?: Record<string, unknown>;
  }): Payment {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes

    const payment = new Payment({
      orderId: data.orderId,
      userId: data.userId,
      status: PaymentStatus.PENDING,
      amount: Money.create(data.amount, data.currency),
      currency: data.currency,
      provider: data.provider,
      description: data.description,
      customerEmail: data.customerEmail,
      customerId: data.customerId,
      paymentMethod: data.paymentMethod,
      paymentMethodId: data.paymentMethodId,
      idempotencyKey: data.idempotencyKey,
      returnUrl: data.returnUrl,
      cancelUrl: data.cancelUrl,
      retryCount: 0,
      maxRetries: Payment.MAX_RETRY_COUNT,
      metadata: data.metadata || {},
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    payment.addDomainEvent(new PaymentInitiatedEvent(
      payment.id,
      payment.orderId,
      payment.amount.amount,
      payment.currency,
      payment.provider,
    ));

    return payment;
  }

  get orderId(): string {
    return this.props.orderId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get provider(): string {
    return this.props.provider;
  }

  get providerPaymentId(): string | undefined {
    return this.props.providerPaymentId;
  }

  get paymentMethod(): string | undefined {
    return this.props.paymentMethod;
  }

  get clientSecret(): string | undefined {
    return this.props.clientSecret;
  }

  get redirectUrl(): string | undefined {
    return this.props.redirectUrl;
  }

  get failureCode(): string | undefined {
    return this.props.failureCode;
  }

  get failureReason(): string | undefined {
    return this.props.failureReason;
  }

  get retryCount(): number {
    return this.props.retryCount;
  }

  get canRetry(): boolean {
    return this.props.status === PaymentStatus.FAILED && 
           this.props.retryCount < this.props.maxRetries;
  }

  get isExpired(): boolean {
    return this.props.expiresAt !== undefined && this.props.expiresAt < new Date();
  }

  get isCompleted(): boolean {
    return this.props.status === PaymentStatus.SUCCEEDED;
  }

  get canRefund(): boolean {
    return this.props.status === PaymentStatus.SUCCEEDED;
  }

  // State transitions
  setProviderResponse(providerPaymentId: string, clientSecret?: string, redirectUrl?: string): void {
    this.props.providerPaymentId = providerPaymentId;
    this.props.clientSecret = clientSecret;
    this.props.redirectUrl = redirectUrl;
    this.touch();
  }

  authorize(): void {
    this.props.status = PaymentStatus.AUTHORIZED;
    this.props.authorizedAt = new Date();
    this.touch();
  }

  capture(amount?: number): void {
    this.props.status = PaymentStatus.CAPTURED;
    this.props.capturedAt = new Date();
    this.touch();
  }

  succeed(): void {
    this.props.status = PaymentStatus.SUCCEEDED;
    this.props.succeededAt = new Date();
    this.touch();
    this.addDomainEvent(new PaymentSucceededEvent(
      this.id,
      this.orderId,
      this.amount.amount,
      this.currency,
    ));
  }

  fail(code: string, reason: string): void {
    this.props.status = PaymentStatus.FAILED;
    this.props.failureCode = code;
    this.props.failureReason = reason;
    this.props.failedAt = new Date();
    this.touch();
    this.addDomainEvent(new PaymentFailedEvent(
      this.id,
      this.orderId,
      code,
      reason,
    ));
  }

  cancel(): void {
    this.props.status = PaymentStatus.CANCELLED;
    this.props.cancelledAt = new Date();
    this.touch();
    this.addDomainEvent(new PaymentCancelledEvent(this.id, this.orderId));
  }

  expire(): void {
    this.props.status = PaymentStatus.EXPIRED;
    this.touch();
  }

  incrementRetryCount(): void {
    this.props.retryCount++;
    this.touch();
  }

  setGatewayResponse(response: Record<string, unknown>): void {
    this.props.gatewayResponse = response;
    this.touch();
  }
}
```

### 2.3 Transaction Entity

```typescript
// modules/payment/domain/entities/transaction.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Money } from '../value-objects/money.vo';

export enum TransactionType {
  AUTHORIZATION = 'authorization',
  CAPTURE = 'capture',
  CHARGE = 'charge',
  REFUND = 'refund',
  PARTIAL_REFUND = 'partial_refund',
  CHARGEBACK = 'chargeback',
  DISPUTE = 'dispute',
  VOID = 'void',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface TransactionProps {
  paymentId: string;
  type: TransactionType;
  amount: Money;
  status: TransactionStatus;
  provider: string;
  providerTransactionId?: string;
  gatewayRequest?: Record<string, unknown>;
  gatewayResponse?: Record<string, unknown>;
  failureCode?: string;
  failureReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export class Transaction extends BaseEntity<TransactionProps> {
  private constructor(props: TransactionProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    paymentId: string;
    type: TransactionType;
    amount: Money;
    provider: string;
    providerTransactionId?: string;
    gatewayRequest?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }): Transaction {
    return new Transaction({
      ...data,
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
    });
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  get providerTransactionId(): string | undefined {
    return this.props.providerTransactionId;
  }

  succeed(providerTransactionId?: string, gatewayResponse?: Record<string, unknown>): void {
    this.props.status = TransactionStatus.SUCCESS;
    this.props.providerTransactionId = providerTransactionId;
    this.props.gatewayResponse = gatewayResponse;
    this.touch();
  }

  fail(failureCode: string, failureReason: string, gatewayResponse?: Record<string, unknown>): void {
    this.props.status = TransactionStatus.FAILED;
    this.props.failureCode = failureCode;
    this.props.failureReason = failureReason;
    this.props.gatewayResponse = gatewayResponse;
    this.touch();
  }
}
```

### 2.4 Refund Entity

```typescript
// modules/payment/domain/entities/refund.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { Money } from '../value-objects/money.vo';
import { RefundStatus, RefundType } from '../enums/refund-status.enum';

export interface RefundProps {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: Money;
  type: RefundType;
  status: RefundStatus;
  reason?: string;
  provider: string;
  providerRefundId?: string;
  gatewayResponse?: Record<string, unknown>;
  operatorId?: string;
  operatorNote?: string;
  metadata?: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Refund extends BaseEntity<RefundProps> {
  private constructor(props: RefundProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    type: RefundType;
    reason?: string;
    provider: string;
    operatorId?: string;
    operatorNote?: string;
  }): Refund {
    return new Refund({
      paymentId: data.paymentId,
      orderId: data.orderId,
      userId: data.userId,
      amount: Money.create(data.amount, data.currency),
      type: data.type,
      status: RefundStatus.PENDING,
      reason: data.reason,
      provider: data.provider,
      operatorId: data.operatorId,
      operatorNote: data.operatorNote,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get paymentId(): string {
    return this.props.paymentId;
  }

  get orderId(): string {
    return this.props.orderId;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get type(): RefundType {
    return this.props.type;
  }

  get status(): RefundStatus {
    return this.props.status;
  }

  get reason(): string | undefined {
    return this.props.reason;
  }

  get isCompleted(): boolean {
    return this.props.status === RefundStatus.COMPLETED;
  }

  process(providerRefundId?: string, gatewayResponse?: Record<string, unknown>): void {
    this.props.status = RefundStatus.PROCESSING;
    this.props.providerRefundId = providerRefundId;
    this.props.gatewayResponse = gatewayResponse;
    this.touch();
  }

  complete(providerRefundId?: string, gatewayResponse?: Record<string, unknown>): void {
    this.props.status = RefundStatus.COMPLETED;
    this.props.providerRefundId = providerRefundId;
    this.props.gatewayResponse = gatewayResponse;
    this.props.processedAt = new Date();
    this.touch();
  }

  fail(failureReason: string, gatewayResponse?: Record<string, unknown>): void {
    this.props.status = RefundStatus.FAILED;
    this.props.gatewayResponse = gatewayResponse;
    this.touch();
  }

  reject(reason: string): void {
    this.props.status = RefundStatus.REJECTED;
    this.props.operatorNote = reason;
    this.touch();
  }
}
```

### 2.5 Wallet Entity

```typescript
// modules/payment/domain/entities/wallet.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Money } from '../value-objects/money.vo';
import { WalletChargedEvent } from '../events/wallet-charged.event';
import { WalletDebitedEvent } from '../events/wallet-debited.event';
import { WalletInsufficientFundsEvent } from '../events/wallet-insufficient-funds.event';

export enum WalletStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

export interface WalletProps {
  userId: string;
  balance: Money;
  status: WalletStatus;
  currency: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Wallet extends AggregateRoot<WalletProps> {
  private constructor(props: WalletProps, id?: string) {
    super(props, id);
  }

  static create(userId: string, currency: string = 'USD'): Wallet {
    return new Wallet({
      userId,
      balance: Money.create(0, currency),
      status: WalletStatus.ACTIVE,
      currency,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get balance(): Money {
    return this.props.balance;
  }

  get status(): WalletStatus {
    return this.props.status;
  }

  get isActive(): boolean {
    return this.props.status === WalletStatus.ACTIVE;
  }

  get hasSufficientFunds(): boolean {
    return this.props.balance.amount > 0;
  }

  canDebit(amount: number): boolean {
    return this.isActive && this.props.balance.amount >= amount;
  }

  debit(amount: number, description: string, referenceId?: string): boolean {
    if (!this.canDebit(amount)) {
      this.addDomainEvent(new WalletInsufficientFundsEvent(
        this.id,
        this.userId,
        amount,
        this.props.balance.amount,
      ));
      return false;
    }

    this.props.balance = this.props.balance.subtract(Money.create(amount, this.props.currency));
    this.touch();

    this.addDomainEvent(new WalletDebitedEvent(
      this.id,
      this.userId,
      amount,
      this.props.balance.amount,
      description,
      referenceId,
    ));

    return true;
  }

  credit(amount: number, description: string, referenceId?: string): void {
    this.props.balance = this.props.balance.add(Money.create(amount, this.props.currency));
    this.touch();

    this.addDomainEvent(new WalletChargedEvent(
      this.id,
      this.userId,
      amount,
      this.props.balance.amount,
      description,
      referenceId,
    ));
  }

  freeze(): void {
    this.props.status = WalletStatus.FROZEN;
    this.touch();
  }

  unfreeze(): void {
    this.props.status = WalletStatus.ACTIVE;
    this.touch();
  }

  close(): void {
    this.props.status = WalletStatus.CLOSED;
    this.touch();
  }
}
```

### 2.6 Payment State Machine

```typescript
// modules/payment/domain/enums/payment-status.enum.ts
export enum PaymentStatus {
  PENDING = 'pending',
  INITIATED = 'initiated',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  REFUND_REQUESTED = 'refund_requested',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  DISPUTED = 'disputed',
  CHARGEBACK = 'chargeback',
}

// modules/payment/domain/state-machine/payment-transitions.ts
import { PaymentStatus } from '../enums/payment-status.enum';

export const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  [PaymentStatus.PENDING]: [
    PaymentStatus.INITIATED,
    PaymentStatus.CANCELLED,
    PaymentStatus.EXPIRED,
  ],
  [PaymentStatus.INITIATED]: [
    PaymentStatus.AUTHORIZED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELLED,
  ],
  [PaymentStatus.AUTHORIZED]: [
    PaymentStatus.CAPTURED,
    PaymentStatus.CANCELLED,
  ],
  [PaymentStatus.CAPTURED]: [
    PaymentStatus.SUCCEEDED,
    PaymentStatus.REFUND_REQUESTED,
  ],
  [PaymentStatus.SUCCEEDED]: [
    PaymentStatus.REFUND_REQUESTED,
    PaymentStatus.PARTIALLY_REFUNDED,
    PaymentStatus.DISPUTED,
  ],
  [PaymentStatus.FAILED]: [
    PaymentStatus.PENDING, // Retry
  ],
  [PaymentStatus.CANCELLED]: [],
  [PaymentStatus.EXPIRED]: [
    PaymentStatus.PENDING, // Retry
  ],
  [PaymentStatus.REFUND_REQUESTED]: [
    PaymentStatus.REFUNDED,
  ],
  [PaymentStatus.REFUNDED]: [],
  [PaymentStatus.PARTIALLY_REFUNDED]: [
    PaymentStatus.REFUND_REQUESTED,
  ],
  [PaymentStatus.DISPUTED]: [
    PaymentStatus.CHARGEBACK,
  ],
  [PaymentStatus.CHARGEBACK]: [],
};

// modules/payment/domain/state-machine/payment-state-machine.ts
import { PaymentStatus } from '../enums/payment-status.enum';
import { PAYMENT_TRANSITIONS } from './payment-transitions';

export class PaymentStateMachine {
  static canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
    const allowedTransitions = PAYMENT_TRANSITIONS[from];
    return allowedTransitions ? allowedTransitions.includes(to) : false;
  }

  static getAllowedTransitions(status: PaymentStatus): PaymentStatus[] {
    return PAYMENT_TRANSITIONS[status] || [];
  }

  static getStatusDescription(status: PaymentStatus): string {
    const descriptions: Record<PaymentStatus, string> = {
      [PaymentStatus.PENDING]: 'Pending',
      [PaymentStatus.INITIATED]: 'Payment Initiated',
      [PaymentStatus.AUTHORIZED]: 'Authorized',
      [PaymentStatus.CAPTURED]: 'Captured',
      [PaymentStatus.SUCCEEDED]: 'Payment Successful',
      [PaymentStatus.FAILED]: 'Payment Failed',
      [PaymentStatus.CANCELLED]: 'Cancelled',
      [PaymentStatus.EXPIRED]: 'Expired',
      [PaymentStatus.REFUND_REQUESTED]: 'Refund Requested',
      [PaymentStatus.REFUNDED]: 'Refunded',
      [PaymentStatus.PARTIALLY_REFUNDED]: 'Partially Refunded',
      [PaymentStatus.DISPUTED]: 'Disputed',
      [PaymentStatus.CHARGEBACK]: 'Chargeback',
    };
    return descriptions[status] || status;
  }
}
```

---

## PART 3 — Application Layer

### 3.1 Create Payment Use Case

```typescript
// modules/payment/application/use-cases/payment/create-payment.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { PaymentRepository } from '../../repositories/payment.repository';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { PaymentAuditService } from '../../services/payment-audit.service';
import { PaymentProviderFactory } from '../../providers/payment-provider.factory';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Payment } from '../../domain/entities/payment.entity';
import { Transaction, TransactionType } from '../../domain/entities/transaction.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { IdempotencyKeyConflictException } from '../../domain/exceptions/idempotency-key-conflict.exception';
import { PaymentProviderErrorException } from '../../domain/exceptions/payment-provider-error.exception';

export interface CreatePaymentInput {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string;
  description?: string;
  customerEmail?: string;
  customerId?: string;
  paymentMethod?: string;
  paymentMethodId?: string;
  idempotencyKey?: string;
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentOutput {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  provider: string;
  clientSecret?: string;
  redirectUrl?: string;
}

@Injectable()
export class CreatePaymentUseCase extends BaseUseCase<CreatePaymentInput, CreatePaymentOutput> {
  private readonly logger = new Logger(CreatePaymentUseCase.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly auditService: PaymentAuditService,
    private readonly providerFactory: PaymentProviderFactory,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: CreatePaymentInput): Promise<Either<Error, CreatePaymentOutput>> {
    // Check idempotency
    if (input.idempotencyKey) {
      const existingPayment = await this.paymentRepository.findByIdempotencyKey(input.idempotencyKey);
      if (existingPayment) {
        return left(new IdempotencyKeyConflictException(input.idempotencyKey));
      }
    }

    // Create payment entity
    const payment = Payment.create({
      orderId: input.orderId,
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      provider: input.provider,
      description: input.description,
      customerEmail: input.customerEmail,
      customerId: input.customerId,
      paymentMethod: input.paymentMethod,
      paymentMethodId: input.paymentMethodId,
      idempotencyKey: input.idempotencyKey,
      returnUrl: input.returnUrl,
      cancelUrl: input.cancelUrl,
      metadata: input.metadata,
    });

    // Get provider
    const provider = this.providerFactory.getProvider(input.provider);

    // Create payment with provider
    const providerResult = await provider.createPayment({
      amount: input.amount,
      currency: input.currency,
      orderId: input.orderId,
      description: input.description || `Payment for order ${input.orderId}`,
      customerId: input.customerId,
      email: input.customerEmail,
      metadata: input.metadata as Record<string, string>,
      returnUrl: input.returnUrl,
      cancelUrl: input.cancelUrl,
    });

    if (!providerResult.success) {
      payment.fail(providerResult.errorCode || 'PROVIDER_ERROR', providerResult.error || 'Payment creation failed');
      await this.paymentRepository.create(payment);
      
      // Audit
      await this.auditService.record({
        action: 'payment_creation_failed',
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount.amount,
        provider: payment.provider,
        error: providerResult.error,
      });

      return left(new PaymentProviderErrorException(providerResult.error || 'Payment creation failed'));
    }

    // Set provider response
    payment.setProviderResponse(
      providerResult.paymentId,
      providerResult.clientSecret,
      providerResult.redirectUrl,
    );

    // Save payment
    const savedPayment = await this.paymentRepository.create(payment);

    // Create initial transaction
    const transaction = Transaction.create({
      paymentId: savedPayment.id,
      type: TransactionType.AUTHORIZATION,
      amount: payment.amount,
      provider: payment.provider,
      providerTransactionId: providerResult.paymentId,
      gatewayRequest: { amount: input.amount, currency: input.currency },
    });

    await this.transactionRepository.create(transaction);

    // Audit
    await this.auditService.record({
      action: 'payment_created',
      paymentId: savedPayment.id,
      orderId: savedPayment.orderId,
      amount: savedPayment.amount.amount,
      provider: savedPayment.provider,
      metadata: { providerPaymentId: providerResult.paymentId },
    });

    // Publish events
    await this.eventBus.publishAll(savedPayment.domainEvents);
    savedPayment.clearEvents();

    this.logger.log(`Payment ${savedPayment.id} created for order ${input.orderId}`);

    return right({
      paymentId: savedPayment.id,
      status: savedPayment.status,
      amount: savedPayment.amount.amount,
      currency: savedPayment.currency,
      provider: savedPayment.provider,
      clientSecret: savedPayment.clientSecret,
      redirectUrl: savedPayment.redirectUrl,
    });
  }
}
```

### 3.2 Process Payment Use Case

```typescript
// modules/payment/application/use-cases/payment/process-payment.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { PaymentRepository } from '../../repositories/payment.repository';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { PaymentAuditService } from '../../services/payment-audit.service';
import { PaymentProviderFactory } from '../../providers/payment-provider.factory';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';
import { PaymentAlreadyProcessedException } from '../../domain/exceptions/payment-already-processed.exception';

export interface ProcessPaymentInput {
  paymentId: string;
  gatewayResponse: Record<string, unknown>;
}

export interface ProcessPaymentOutput {
  paymentId: string;
  status: string;
  message: string;
}

@Injectable()
export class ProcessPaymentUseCase extends BaseUseCase<ProcessPaymentInput, ProcessPaymentOutput> {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly auditService: PaymentAuditService,
    private readonly providerFactory: PaymentProviderFactory,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: ProcessPaymentInput): Promise<Either<Error, ProcessPaymentOutput>> {
    // Get payment
    const payment = await this.paymentRepository.findById(input.paymentId);
    if (!payment) {
      return left(new PaymentNotFoundException(input.paymentId));
    }

    if (payment.isCompleted) {
      return left(new PaymentAlreadyProcessedException(input.paymentId));
    }

    // Set gateway response
    payment.setGatewayResponse(input.gatewayResponse);

    // Determine status from gateway response
    const gatewayStatus = this.determineGatewayStatus(input.gatewayResponse);

    switch (gatewayStatus) {
      case 'succeeded':
        payment.succeed();
        break;
      case 'failed':
        const failureCode = (input.gatewayResponse.error_code as string) || 'UNKNOWN';
        const failureReason = (input.gatewayResponse.error_message as string) || 'Payment failed';
        payment.fail(failureCode, failureReason);
        break;
      case 'cancelled':
        payment.cancel();
        break;
      default:
        payment.setGatewayResponse(input.gatewayResponse);
    }

    // Save payment
    await this.paymentRepository.update(payment.id, payment);

    // Create transaction record
    const transaction = await this.transactionRepository.create({
      paymentId: payment.id,
      type: 'capture' as any,
      amount: payment.amount,
      status: gatewayStatus === 'succeeded' ? 'success' : 'failed',
      provider: payment.provider,
      providerTransactionId: payment.providerPaymentId,
      gatewayResponse: input.gatewayResponse,
    });

    // Audit
    await this.auditService.record({
      action: `payment_${gatewayStatus}`,
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount.amount,
      provider: payment.provider,
      gatewayResponse: input.gatewayResponse,
    });

    // Publish events
    await this.eventBus.publishAll(payment.domainEvents);
    payment.clearEvents();

    this.logger.log(`Payment ${payment.id} processed with status: ${gatewayStatus}`);

    return right({
      paymentId: payment.id,
      status: payment.status,
      message: `Payment ${gatewayStatus}`,
    });
  }

  private determineGatewayStatus(response: Record<string, unknown>): string {
    const status = (response.status as string)?.toLowerCase();
    const paid = response.paid as boolean;

    if (paid || status === 'succeeded' || status === 'paid' || status === 'completed') {
      return 'succeeded';
    }
    if (status === 'failed' || status === 'error') {
      return 'failed';
    }
    if (status === 'cancelled' || status === 'canceled') {
      return 'cancelled';
    }
    return 'pending';
  }
}
```

### 3.3 Request Refund Use Case

```typescript
// modules/payment/application/use-cases/refund/request-refund.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { PaymentRepository } from '../../repositories/payment.repository';
import { RefundRepository } from '../../repositories/refund.repository';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { PaymentAuditService } from '../../services/payment-audit.service';
import { PaymentProviderFactory } from '../../providers/payment-provider.factory';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Refund } from '../../domain/entities/refund.entity';
import { Transaction, TransactionType } from '../../domain/entities/transaction.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';
import { RefundAmountExceedsException } from '../../domain/exceptions/refund-amount-exceeds.exception';
import { RefundNotAllowedException } from '../../domain/exceptions/refund-not-allowed.exception';

export interface RequestRefundInput {
  paymentId: string;
  amount: number;
  reason?: string;
  operatorId?: string;
  operatorNote?: string;
}

export interface RequestRefundOutput {
  refundId: string;
  status: string;
  amount: number;
  message: string;
}

@Injectable()
export class RequestRefundUseCase extends BaseUseCase<RequestRefundInput, RequestRefundOutput> {
  private readonly logger = new Logger(RequestRefundUseCase.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly refundRepository: RefundRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly auditService: PaymentAuditService,
    private readonly providerFactory: PaymentProviderFactory,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: RequestRefundInput): Promise<Either<Error, RequestRefundOutput>> {
    // Get payment
    const payment = await this.paymentRepository.findById(input.paymentId);
    if (!payment) {
      return left(new PaymentNotFoundException(input.paymentId));
    }

    // Check if refund is allowed
    if (!payment.canRefund) {
      return left(new RefundNotAllowedException(input.paymentId, payment.status));
    }

    // Calculate total refunded amount
    const existingRefunds = await this.refundRepository.findByPaymentId(input.paymentId);
    const totalRefunded = existingRefunds
      .filter(r => r.isCompleted)
      .reduce((sum, r) => sum + r.amount.amount, 0);

    // Check if refund amount exceeds available amount
    if (totalRefunded + input.amount > payment.amount.amount) {
      return left(new RefundAmountExceedsException(
        input.amount,
        payment.amount.amount - totalRefunded,
      ));
    }

    // Determine refund type
    const refundType = input.amount === payment.amount.amount - totalRefunded
      ? 'full' as const
      : 'partial' as const;

    // Create refund
    const refund = Refund.create({
      paymentId: input.paymentId,
      orderId: payment.orderId,
      userId: payment.userId,
      amount: input.amount,
      currency: payment.currency,
      type: refundType,
      reason: input.reason,
      provider: payment.provider,
      operatorId: input.operatorId,
      operatorNote: input.operatorNote,
    });

    // Process refund with provider
    const provider = this.providerFactory.getProvider(payment.provider);
    
    try {
      const providerResult = await provider.refund({
        paymentId: payment.providerPaymentId!,
        amount: input.amount,
        reason: input.reason,
      });

      if (providerResult.success) {
        refund.complete(providerResult.refundId, providerResult.metadata);
      } else {
        refund.fail(providerResult.error || 'Refund failed');
      }
    } catch (error) {
      this.logger.error(`Provider refund failed: ${error}`);
      refund.fail('Provider error during refund');
    }

    // Save refund
    const savedRefund = await this.refundRepository.create(refund);

    // Create transaction
    const transaction = Transaction.create({
      paymentId: input.paymentId,
      type: refundType === 'full' ? TransactionType.REFUND : TransactionType.PARTIAL_REFUND,
      amount: refund.amount,
      provider: payment.provider,
      providerTransactionId: refund.props.providerRefundId,
    });

    await this.transactionRepository.create(transaction);

    // Audit
    await this.auditService.record({
      action: 'refund_requested',
      paymentId: input.paymentId,
      orderId: payment.orderId,
      amount: input.amount,
      provider: payment.provider,
      metadata: { refundId: savedRefund.id, reason: input.reason },
    });

    this.logger.log(`Refund ${savedRefund.id} created for payment ${input.paymentId}`);

    return right({
      refundId: savedRefund.id,
      status: savedRefund.status,
      amount: savedRefund.amount.amount,
      message: `Refund of ${input.amount} ${payment.currency} ${refundType === 'full' ? 'requested' : 'partially requested'}`,
    });
  }
}
```

### 3.4 Charge Wallet Use Case

```typescript
// modules/payment/application/use-cases/wallet/charge-wallet.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { WalletRepository } from '../../repositories/wallet.repository';
import { WalletTransactionRepository } from '../../repositories/wallet-transaction.repository';
import { PaymentAuditService } from '../../services/payment-audit.service';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { WalletNotFoundException } from '../../domain/exceptions/wallet-not-found.exception';
import { WalletInsufficientFundsException } from '../../domain/exceptions/wallet-insufficient-funds.exception';

export interface ChargeWalletInput {
  userId: string;
  amount: number;
  description: string;
  orderId?: string;
}

export interface ChargeWalletOutput {
  walletId: string;
  balance: number;
  transactionId: string;
}

@Injectable()
export class ChargeWalletUseCase extends BaseUseCase<ChargeWalletInput, ChargeWalletOutput> {
  private readonly logger = new Logger(ChargeWalletUseCase.name);

  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly walletTransactionRepository: WalletTransactionRepository,
    private readonly auditService: PaymentAuditService,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: ChargeWalletInput): Promise<Either<Error, ChargeWalletOutput>> {
    // Get wallet
    const wallet = await this.walletRepository.findByUserId(input.userId);
    if (!wallet) {
      return left(new WalletNotFoundException(input.userId));
    }

    // Check balance
    if (!wallet.canDebit(input.amount)) {
      return left(new WalletInsufficientFundsException(
        input.amount,
        wallet.balance.amount,
      ));
    }

    // Debit wallet
    const success = wallet.debit(input.amount, input.description, input.orderId);

    if (!success) {
      return left(new WalletInsufficientFundsException(
        input.amount,
        wallet.balance.amount,
      ));
    }

    // Save wallet
    await this.walletRepository.update(wallet.id, wallet);

    // Create wallet transaction
    const transaction = await this.walletTransactionRepository.create({
      walletId: wallet.id,
      type: 'debit',
      amount: input.amount,
      balance: wallet.balance.amount,
      description: input.description,
      referenceId: input.orderId,
    });

    // Audit
    await this.auditService.record({
      action: 'wallet_debited',
      paymentId: wallet.id,
      orderId: input.orderId || '',
      amount: input.amount,
      provider: 'wallet',
      metadata: { userId: input.userId, description: input.description },
    });

    // Publish events
    await this.eventBus.publishAll(wallet.domainEvents);
    wallet.clearEvents();

    this.logger.log(`Wallet ${wallet.id} debited ${input.amount} for user ${input.userId}`);

    return right({
      walletId: wallet.id,
      balance: wallet.balance.amount,
      transactionId: transaction.id,
    });
  }
}
```

---

## PART 4 — Infrastructure Layer

### 4.1 Stripe Provider

```typescript
// modules/payment/infrastructure/providers/stripe/stripe.provider.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentProvider, CreatePaymentRequest, PaymentResult, RefundRequest, RefundResult } from '../payment-provider.interface';

@Injectable()
export class StripeProvider implements PaymentProvider {
  readonly name = 'Stripe';
  readonly code = 'stripe';

  private readonly logger = new Logger(StripeProvider.name);
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPayment(data: CreatePaymentRequest): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        description: data.description,
        metadata: {
          orderId: data.orderId,
          ...data.metadata,
        },
        receipt_email: data.email,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        paymentId: paymentIntent.id,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      this.logger.error('Stripe createPayment error:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error.message,
        errorCode: error.code,
      };
    }
  }

  async capturePayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.capture(
        paymentId,
        amount ? { amount_to_capture: Math.round(amount * 100) } : undefined,
      );

      return {
        success: true,
        paymentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      this.logger.error('Stripe capturePayment error:', error);
      return {
        success: false,
        paymentId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentId);

      return {
        success: true,
        paymentId: paymentIntent.id,
        status: 'cancelled',
      };
    } catch (error) {
      this.logger.error('Stripe cancelPayment error:', error);
      return {
        success: false,
        paymentId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      this.logger.error('Stripe getPaymentStatus error:', error);
      throw error;
    }
  }

  async refund(data: RefundRequest): Promise<RefundResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: data.paymentId,
        amount: Math.round(data.amount * 100),
        reason: data.reason as any,
        metadata: data.metadata,
      });

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
      };
    } catch (error) {
      this.logger.error('Stripe refund error:', error);
      return {
        success: false,
        refundId: '',
        status: 'failed',
        amount: data.amount,
        error: error.message,
      };
    }
  }

  async getRefundStatus(refundId: string): Promise<any> {
    try {
      const refund = await this.stripe.refunds.retrieve(refundId);

      return {
        status: refund.status,
        amount: refund.amount / 100,
      };
    } catch (error) {
      this.logger.error('Stripe getRefundStatus error:', error);
      throw error;
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
      this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return true;
    } catch (error) {
      this.logger.error('Stripe webhook signature verification failed:', error);
      return false;
    }
  }

  async createPaymentMethod(data: any): Promise<any> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(data.token, {
        customer: data.customerId,
      });

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        type: paymentMethod.type,
        lastFour: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        expiresAt: paymentMethod.card?.exp_year
          ? new Date(paymentMethod.card.exp_year, paymentMethod.card.exp_month - 1)
          : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    await this.stripe.paymentMethods.detach(paymentMethodId);
  }

  async getPaymentMethods(customerId: string): Promise<any[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data.map((pm) => ({
      paymentMethodId: pm.id,
      type: pm.type,
      lastFour: pm.card?.last4,
      brand: pm.card?.brand,
      expiresAt: pm.card?.exp_year
        ? new Date(pm.card.exp_year, pm.card.exp_month - 1)
        : undefined,
    }));
  }
}
```

### 4.2 Payment Provider Factory

```typescript
// modules/payment/infrastructure/providers/payment-provider.factory.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from './payment-provider.interface';
import { StripeProvider } from './stripe/stripe.provider';

@Injectable()
export class PaymentProviderFactory {
  private readonly logger = new Logger(PaymentProviderFactory.name);
  private readonly providers: Map<string, PaymentProvider> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize Stripe
    if (this.configService.get('STRIPE_SECRET_KEY')) {
      this.providers.set('stripe', new StripeProvider(this.configService));
      this.logger.log('Stripe provider initialized');
    }

    // Initialize other providers as needed
    // if (this.configService.get('PAYPAL_CLIENT_ID')) {
    //   this.providers.set('paypal', new PayPalProvider(this.configService));
    // }
  }

  getProvider(code: string): PaymentProvider {
    const provider = this.providers.get(code);
    if (!provider) {
      throw new Error(`Payment provider '${code}' not found or not configured`);
    }
    return provider;
  }

  getAvailableProviders(): Array<{ code: string; name: string }> {
    return Array.from(this.providers.values()).map((p) => ({
      code: p.code,
      name: p.name,
    }));
  }
}
```

### 4.3 Payment Webhook Service

```typescript
// modules/payment/infrastructure/services/payment-webhook.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PaymentProviderFactory } from '../providers/payment-provider.factory';
import { PaymentRepository } from '../../application/repositories/payment.repository';
import { RefundRepository } from '../../application/repositories/refund.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(PaymentWebhookService.name);

  constructor(
    private readonly providerFactory: PaymentProviderFactory,
    private readonly paymentRepository: PaymentRepository,
    private readonly refundRepository: RefundRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handleWebhook(
    provider: string,
    payload: string,
    signature: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verify signature
      const providerInstance = this.providerFactory.getProvider(provider);
      const isValid = providerInstance.verifyWebhookSignature(payload, signature);

      if (!isValid) {
        this.logger.warn(`Invalid webhook signature for provider: ${provider}`);
        return { success: false, message: 'Invalid signature' };
      }

      // Parse payload
      const event = JSON.parse(payload);
      this.logger.log(`Received webhook: ${event.type} from ${provider}`);

      // Process event based on type
      await this.processWebhookEvent(provider, event);

      return { success: true, message: 'Webhook processed' };
    } catch (error) {
      this.logger.error(`Webhook processing error: ${error}`);
      return { success: false, message: 'Processing error' };
    }
  }

  private async processWebhookEvent(provider: string, event: any): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(provider, event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(provider, event.data.object);
        break;
      case 'charge.refunded':
        await this.handleRefundCompleted(provider, event.data.object);
        break;
      case 'charge.dispute.created':
        await this.handleDisputeCreated(provider, event.data.object);
        break;
      default:
        this.logger.log(`Unhandled webhook event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(provider: string, paymentIntent: any): Promise<void> {
    const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntent.id);
    if (payment && !payment.isCompleted) {
      payment.succeed();
      payment.setGatewayResponse(paymentIntent);
      await this.paymentRepository.update(payment.id, payment);
      await this.eventBus.publishAll(payment.domainEvents);
      payment.clearEvents();
    }
  }

  private async handlePaymentFailed(provider: string, paymentIntent: any): Promise<void> {
    const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntent.id);
    if (payment && !payment.isCompleted) {
      const failureCode = paymentIntent.last_payment_error?.code || 'UNKNOWN';
      const failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
      payment.fail(failureCode, failureReason);
      payment.setGatewayResponse(paymentIntent);
      await this.paymentRepository.update(payment.id, payment);
      await this.eventBus.publishAll(payment.domainEvents);
      payment.clearEvents();
    }
  }

  private async handleRefundCompleted(provider: string, charge: any): Promise<void> {
    const refundId = charge.refunds.data[0]?.id;
    if (refundId) {
      const refund = await this.refundRepository.findByProviderRefundId(refundId);
      if (refund && !refund.isCompleted) {
        refund.complete(refundId, charge);
        await this.refundRepository.update(refund.id, refund);
      }
    }
  }

  private async handleDisputeCreated(provider: string, dispute: any): Promise<void> {
    const payment = await this.paymentRepository.findByProviderPaymentId(dispute.payment_intent);
    if (payment) {
      payment.props.status = 'disputed' as any;
      payment.setGatewayResponse(dispute);
      await this.paymentRepository.update(payment.id, payment);
    }
  }
}
```

---

## PART 5 — Presentation Layer

### 5.1 Payment Controller

```typescript
// modules/payment/presentation/controllers/payment.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../../shared/presentation/controllers/base.controller';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { CreatePaymentDto } from '../dto/create-payment.dto';

// Use Cases
import { CreatePaymentUseCase } from '../../application/use-cases/payment/create-payment.use-case';
import { GetPaymentUseCase } from '../../application/use-cases/payment/get-payment.use-case';
import { GetPaymentHistoryUseCase } from '../../application/use-cases/payment/get-payment-history.use-case';
import { CancelPaymentUseCase } from '../../application/use-cases/payment/cancel-payment.use-case';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController extends BaseController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly getPaymentHistoryUseCase: GetPaymentHistoryUseCase,
    private readonly cancelPaymentUseCase: CancelPaymentUseCase,
  ) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  async createPayment(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    const result = await this.createPaymentUseCase.execute({
      ...dto,
      userId,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment' })
  @ApiResponse({ status: 200, description: 'Payment retrieved' })
  async getPayment(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.getPaymentUseCase.execute({ paymentId: id, userId });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get()
  @ApiOperation({ summary: 'Get payment history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Payment history' })
  async getPaymentHistory(
    @CurrentUser('sub') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.getPaymentHistoryUseCase.execute({
      userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel payment' })
  @ApiResponse({ status: 200, description: 'Payment cancelled' })
  async cancelPayment(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.cancelPaymentUseCase.execute({ paymentId: id, userId });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }
}
```

### 5.2 Webhook Controller

```typescript
// modules/payment/presentation/controllers/webhook.controller.ts
import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentWebhookService } from '../../infrastructure/services/payment-webhook.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: PaymentWebhookService) {}

  @Post(':provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle payment webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Headers('paypal-transmission-sig') paypalSignature: string,
    @Body() payload: any,
  ) {
    const provider = payload.provider || 'stripe';
    const signatureToUse = provider === 'paypal' ? paypalSignature : signature;

    this.logger.log(`Received webhook from ${provider}`);

    const result = await this.webhookService.handleWebhook(
      provider,
      JSON.stringify(payload),
      signatureToUse,
    );

    return { received: result.success };
  }
}
```

### 5.3 Refund Controller

```typescript
// modules/payment/presentation/controllers/refund.controller.ts
import {
  Controller,
  Get,
  Post,
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
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { RequestRefundDto } from '../dto/request-refund.dto';

// Use Cases
import { RequestRefundUseCase } from '../../application/use-cases/refund/request-refund.use-case';
import { GetRefundStatusUseCase } from '../../application/use-cases/refund/get-refund-status.use-case';
import { GetRefundHistoryUseCase } from '../../application/use-cases/refund/get-refund-history.use-case';

@ApiTags('Refunds')
@Controller('refunds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefundController extends BaseController {
  constructor(
    private readonly requestRefundUseCase: RequestRefundUseCase,
    private readonly getRefundStatusUseCase: GetRefundStatusUseCase,
    private readonly getRefundHistoryUseCase: GetRefundHistoryUseCase,
  ) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request refund' })
  @ApiResponse({ status: 201, description: 'Refund requested' })
  async requestRefund(
    @CurrentUser('sub') userId: string,
    @Body() dto: RequestRefundDto,
  ) {
    const result = await this.requestRefundUseCase.execute({
      paymentId: dto.paymentId,
      amount: dto.amount,
      reason: dto.reason,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get refund status' })
  @ApiResponse({ status: 200, description: 'Refund status' })
  async getRefundStatus(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.getRefundStatusUseCase.execute({ refundId: id, userId });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get()
  @ApiOperation({ summary: 'Get refund history' })
  @ApiQuery({ name: 'paymentId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Refund history' })
  async getRefundHistory(
    @CurrentUser('sub') userId: string,
    @Query('paymentId') paymentId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.getRefundHistoryUseCase.execute({
      userId,
      paymentId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }
}
```

### 5.4 Wallet Controller

```typescript
// modules/payment/presentation/controllers/wallet.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../../shared/presentation/controllers/base.controller';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { ChargeWalletDto } from '../dto/charge-wallet.dto';

// Use Cases
import { GetWalletUseCase } from '../../application/use-cases/wallet/get-wallet.use-case';
import { GetWalletBalanceUseCase } from '../../application/use-cases/wallet/get-wallet-balance.use-case';
import { ChargeWalletUseCase } from '../../application/use-cases/wallet/charge-wallet.use-case';
import { CreditWalletUseCase } from '../../application/use-cases/wallet/credit-wallet.use-case';
import { GetWalletTransactionsUseCase } from '../../application/use-cases/wallet/get-wallet-transactions.use-case';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController extends BaseController {
  constructor(
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly getWalletBalanceUseCase: GetWalletBalanceUseCase,
    private readonly chargeWalletUseCase: ChargeWalletUseCase,
    private readonly creditWalletUseCase: CreditWalletUseCase,
    private readonly getWalletTransactionsUseCase: GetWalletTransactionsUseCase,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get wallet' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved' })
  async getWallet(@CurrentUser('sub') userId: string) {
    const result = await this.getWalletUseCase.execute({ userId });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  async getBalance(@CurrentUser('sub') userId: string) {
    const result = await this.getWalletBalanceUseCase.execute({ userId });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post('charge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Charge wallet' })
  @ApiResponse({ status: 200, description: 'Wallet charged' })
  async chargeWallet(
    @CurrentUser('sub') userId: string,
    @Body() dto: ChargeWalletDto,
  ) {
    const result = await this.chargeWalletUseCase.execute({
      userId,
      amount: dto.amount,
      description: dto.description,
      orderId: dto.orderId,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post('credit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Credit wallet' })
  @ApiResponse({ status: 200, description: 'Wallet credited' })
  async creditWallet(
    @CurrentUser('sub') userId: string,
    @Body() dto: { amount: number; description: string },
  ) {
    const result = await this.creditWalletUseCase.execute({
      userId,
      amount: dto.amount,
      description: dto.description,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Transactions retrieved' })
  async getTransactions(
    @CurrentUser('sub') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.getWalletTransactionsUseCase.execute({
      userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }
}
```

---

## PART 6 — Angular Implementation

### 6.1 Payment Selection Component

```typescript
// features/payment/components/payment-selection/payment-selection.component.ts
import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

export interface PaymentOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-payment-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent],
  template: `
    <div class="payment-selection">
      <h2>Select Payment Method</h2>
      
      <div class="payment-options">
        @for (option of paymentOptions(); track option.id) {
          <label
            class="payment-option"
            [class.selected]="selectedMethod() === option.id"
            [class.disabled]="!option.enabled">
            <input
              type="radio"
              name="payment"
              [value]="option.id"
              [checked]="selectedMethod() === option.id"
              [disabled]="!option.enabled"
              (change)="selectMethod(option.id)" />
            <div class="option-content">
              <span class="option-icon" [innerHTML]="option.icon"></span>
              <div class="option-info">
                <span class="option-name">{{ option.name }}</span>
                <span class="option-description">{{ option.description }}</span>
              </div>
            </div>
            <span class="option-check" *ngIf="selectedMethod() === option.id">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </label>
        }
      </div>

      @if (selectedMethod() === 'credit_card') {
        <div class="card-form">
          <div class="form-group">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              [(ngModel)]="cardNumber"
              maxlength="19"
              (input)="formatCardNumber()" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                [(ngModel)]="expiryDate"
                maxlength="5"
                (input)="formatExpiry()" />
            </div>
            <div class="form-group">
              <label>CVC</label>
              <input
                type="text"
                placeholder="123"
                [(ngModel)]="cvc"
                maxlength="4" />
            </div>
          </div>
          <div class="form-group">
            <label>Name on Card</label>
            <input
              type="text"
              placeholder="John Doe"
              [(ngModel)]="cardName" />
          </div>
        </div>
      }

      <div class="payment-actions">
        <app-button
          (clicked)="onContinue()"
          [disabled]="!selectedMethod() || processing()">
          {{ processing() ? 'Processing...' : 'Continue to Payment' }}
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    .payment-selection {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }
    .payment-selection h2 {
      margin: 0 0 1.5rem;
      font-size: 1.125rem;
    }
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .payment-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s;
    }
    .payment-option:hover:not(.disabled) {
      border-color: var(--color-primary-300);
    }
    .payment-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }
    .payment-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .payment-option input {
      display: none;
    }
    .option-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }
    .option-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-neutral-100);
      border-radius: var(--radius-md);
    }
    .option-name {
      display: block;
      font-weight: 500;
    }
    .option-description {
      display: block;
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
    .option-check {
      color: var(--color-primary-600);
    }
    .card-form {
      background: var(--color-surface);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: var(--text-sm);
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--text-base);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .payment-actions {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class PaymentSelectionComponent {
  paymentOptions = signal<PaymentOption[]>([
    { id: 'credit_card', name: 'Credit Card', icon: '💳', description: 'Pay with Visa, Mastercard, or Amex', enabled: true },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Pay with your PayPal account', enabled: true },
    { id: 'wallet', name: 'Wallet', icon: '💰', description: 'Pay with your wallet balance', enabled: true },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', description: 'Transfer directly from your bank', enabled: false },
  ]);

  selectedMethod = signal<string | null>(null);
  processing = signal(false);

  cardNumber = '';
  expiryDate = '';
  cvc = '';
  cardName = '';

  paymentComplete = output<{
    method: string;
    cardDetails?: {
      number: string;
      expiry: string;
      cvc: string;
      name: string;
    };
  }>();

  selectMethod(methodId: string) {
    this.selectedMethod.set(methodId);
  }

  formatCardNumber() {
    let value = this.cardNumber.replace(/\s/g, '').replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    this.cardNumber = formatted;
  }

  formatExpiry() {
    let value = this.expiryDate.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    this.expiryDate = value;
  }

  onContinue() {
    if (!this.selectedMethod()) return;

    this.processing.set(true);

    this.paymentComplete.emit({
      method: this.selectedMethod()!,
      cardDetails: this.selectedMethod() === 'credit_card' ? {
        number: this.cardNumber.replace(/\s/g, ''),
        expiry: this.expiryDate,
        cvc: this.cvc,
        name: this.cardName,
      } : undefined,
    });
  }
}
```

### 6.2 Payment Status Component

```typescript
// features/payment/components/payment-status/payment-status.component.ts
import { Component, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { PaymentService, Payment } from '../../services/payment.service';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ButtonComponent],
  template: `
    <div class="payment-status">
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Processing payment...</p>
        </div>
      } @else if (payment()) {
        @if (payment()!.status === 'succeeded') {
          <div class="status-card success">
            <div class="status-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1>Payment Successful!</h1>
            <p>Your payment has been processed successfully.</p>
            <div class="payment-details">
              <div class="detail-row">
                <span>Payment ID</span>
                <span>{{ payment()!.id }}</span>
              </div>
              <div class="detail-row">
                <span>Amount</span>
                <span>{{ payment()!.amount | currency }}</span>
              </div>
              <div class="detail-row">
                <span>Method</span>
                <span>{{ payment()!.method }}</span>
              </div>
              <div class="detail-row">
                <span>Date</span>
                <span>{{ payment()!.createdAt | date:'medium' }}</span>
              </div>
            </div>
            <div class="status-actions">
              <a routerLink="/orders">
                <app-button>View Order</app-button>
              </a>
              <a routerLink="/products">
                <app-button variant="secondary">Continue Shopping</app-button>
              </a>
            </div>
          </div>
        } @else if (payment()!.status === 'failed') {
          <div class="status-card failed">
            <div class="status-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h1>Payment Failed</h1>
            <p>{{ payment()!.failureReason || 'Your payment could not be processed.' }}</p>
            <div class="payment-details">
              <div class="detail-row">
                <span>Payment ID</span>
                <span>{{ payment()!.id }}</span>
              </div>
              <div class="detail-row">
                <span>Amount</span>
                <span>{{ payment()!.amount | currency }}</span>
              </div>
              <div class="detail-row">
                <span>Error</span>
                <span class="error">{{ payment()!.failureCode }}</span>
              </div>
            </div>
            <div class="status-actions">
              <app-button (clicked)="retryPayment()">Try Again</app-button>
              <a routerLink="/cart">
                <app-button variant="secondary">Back to Cart</app-button>
              </a>
            </div>
          </div>
        } @else {
          <div class="status-card pending">
            <div class="spinner"></div>
            <h1>Processing Payment...</h1>
            <p>Please wait while we process your payment.</p>
            <p class="status-text">Status: {{ payment()!.status }}</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .payment-status {
      max-width: 500px;
      margin: 0 auto;
      padding: 2rem;
    }
    .status-card {
      text-align: center;
      background: white;
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      box-shadow: var(--shadow-lg);
    }
    .status-icon {
      margin-bottom: 1.5rem;
    }
    .status-card.success .status-icon { color: var(--color-success); }
    .status-card.failed .status-icon { color: var(--color-error); }
    .status-card.pending .status-icon { color: var(--color-primary-600); }
    .status-card h1 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
    }
    .status-card > p {
      color: var(--color-text-secondary);
      margin: 0 0 2rem;
    }
    .payment-details {
      background: var(--color-surface);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-bottom: 2rem;
      text-align: left;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--color-border);
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-row span:first-child {
      color: var(--color-text-secondary);
    }
    .error {
      color: var(--color-error);
    }
    .status-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: var(--radius-lg);
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-border);
      border-top-color: var(--color-primary-600);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .status-text {
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
    }
  `]
})
export class PaymentStatusComponent implements OnInit {
  paymentId = input.required<string>();

  payment = signal<Payment | null>(null);
  loading = signal(true);

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayment();
  }

  loadPayment(): void {
    this.loading.set(true);
    this.paymentService.getPayment(this.paymentId()).subscribe({
      next: (payment) => {
        this.payment.set(payment);
        this.loading.set(false);

        // If pending, poll for status
        if (payment.status === 'pending' || payment.status === 'initiated') {
          this.pollPaymentStatus();
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  pollPaymentStatus(): void {
    const pollInterval = setInterval(() => {
      this.paymentService.getPayment(this.paymentId()).subscribe({
        next: (payment) => {
          this.payment.set(payment);
          if (payment.status !== 'pending' && payment.status !== 'initiated') {
            clearInterval(pollInterval);
          }
        },
      });
    }, 3000);

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 300000);
  }

  retryPayment(): void {
    // Navigate back to checkout
    window.history.back();
  }
}
```

### 6.3 Transaction History Component

```typescript
// features/payment/components/transaction-history/transaction-history.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentService, Transaction } from '../../services/payment.service';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, PaginationComponent],
  template: `
    <div class="transaction-history">
      <h2>Transaction History</h2>

      @if (loading()) {
        <div class="loading">
          @for (i of [1, 2, 3]; track i) {
            <div class="skeleton-row"></div>
          }
        </div>
      } @else if (transactions().length === 0) {
        <div class="empty-state">
          <p>No transactions yet</p>
        </div>
      } @else {
        <div class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (transaction of transactions(); track transaction.id) {
                <tr>
                  <td>{{ transaction.createdAt | date:'short' }}</td>
                  <td>{{ transaction.description }}</td>
                  <td>
                    <span class="type-badge" [class]="transaction.type">
                      {{ transaction.type }}
                    </span>
                  </td>
                  <td [class.credit]="transaction.amount > 0" [class.debit]="transaction.amount < 0">
                    {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount | currency }}
                  </td>
                  <td>
                    <span class="status-badge" [class]="transaction.status">
                      {{ transaction.status }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <app-pagination
          [currentPage]="currentPage()"
          [totalPages]="totalPages()"
          (pageChange)="onPageChange($event)" />
      }
    </div>
  `,
  styles: [`
    .transaction-history {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }
    .transaction-history h2 {
      margin: 0 0 1.5rem;
      font-size: 1.125rem;
    }
    .transactions-table {
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
    .type-badge {
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      text-transform: capitalize;
    }
    .type-badge.charge { background: #dbeafe; color: #2563eb; }
    .type-badge.refund { background: #dcfce7; color: #16a34a; }
    .type-badge.credit { background: #fef3c7; color: #d97706; }
    .credit { color: #16a34a; }
    .debit { color: #dc2626; }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      text-transform: capitalize;
    }
    .status-badge.success { background: #dcfce7; color: #16a34a; }
    .status-badge.pending { background: #fef3c7; color: #d97706; }
    .status-badge.failed { background: #fee2e2; color: #dc2626; }
    .loading {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .skeleton-row {
      height: 40px;
      background: var(--color-neutral-100);
      border-radius: var(--radius-sm);
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-secondary);
    }
  `]
})
export class TransactionHistoryComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading.set(true);
    this.paymentService.getTransactions({ page: this.currentPage() }).subscribe({
      next: (result) => {
        this.transactions.set(result.transactions);
        this.totalPages.set(result.meta.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadTransactions();
  }
}
```

---

## PART 7 — APIs Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Payments** |
| POST | `/payments` | Yes | Create payment |
| GET | `/payments` | Yes | Get payment history |
| GET | `/payments/:id` | Yes | Get payment details |
| POST | `/payments/:id/cancel` | Yes | Cancel payment |
| POST | `/payments/:id/retry` | Yes | Retry failed payment |
| **Refunds** |
| POST | `/refunds` | Yes | Request refund |
| GET | `/refunds` | Yes | Get refund history |
| GET | `/refunds/:id` | Yes | Get refund status |
| POST | `/admin/refunds/:id/process` | Yes (Admin) | Process refund |
| **Wallet** |
| GET | `/wallet` | Yes | Get wallet |
| GET | `/wallet/balance` | Yes | Get balance |
| POST | `/wallet/charge` | Yes | Charge wallet |
| POST | `/wallet/credit` | Yes | Credit wallet |
| GET | `/wallet/transactions` | Yes | Get transactions |
| POST | `/wallet/transfer` | Yes | Transfer funds |
| **Webhooks** |
| POST | `/webhooks/:provider` | No | Handle webhook |
| POST | `/webhooks/stripe` | No | Stripe webhook |
| POST | `/webhooks/paypal` | No | PayPal webhook |
| **Admin** |
| GET | `/admin/payments` | Yes (Admin) | List payments |
| GET | `/admin/payments/stats` | Yes (Admin) | Payment statistics |
| POST | `/admin/payments/:id/refund` | Yes (Admin) | Process refund |
| GET | `/admin/payments/export` | Yes (Admin) | Export payments |

---

## PART 8 — Events

```typescript
// Payment Domain Events
export const PAYMENT_EVENTS = {
  // Payment Events
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED: 'payment.captured',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_CANCELLED: 'payment.cancelled',
  PAYMENT_EXPIRED: 'payment.expired',
  PAYMENT_RETRY: 'payment.retry',
  
  // Refund Events
  REFUND_REQUESTED: 'payment.refund.requested',
  REFUND_COMPLETED: 'payment.refund.completed',
  REFUND_FAILED: 'payment.refund.failed',
  
  // Wallet Events
  WALLET_CHARGED: 'payment.wallet.charged',
  WALLET_DEBITED: 'payment.wallet.debited',
  WALLET_INSUFFICIENT_FUNDS: 'payment.wallet.insufficient_funds',
  
  // Dispute Events
  PAYMENT_DISPUTE: 'payment.dispute.created',
  PAYMENT_CHARGEBACK: 'payment.chargeback.created',
};
```

---

## Summary

### Deliverables

| Deliverable | Status | Description |
|-------------|--------|-------------|
| Complete Payment Module | ✅ | Full payment lifecycle management |
| Gateway Abstraction | ✅ | Provider interface, factory, Stripe implementation |
| Refund System | ✅ | Full/partial refunds, validation, history |
| Financial Audit | ✅ | Immutable audit trail for all transactions |
| Wallet System | ✅ | Balance, charge, credit, transactions (future-ready) |
| Webhook Handling | ✅ | Signature verification, event processing, retry |
| Security | ✅ | Idempotency, encryption, PCI-DSS recommendations |
| REST APIs | ✅ | 20+ endpoints |
| Angular UI | ✅ | Payment selection, status, transaction history |
| Events | ✅ | 15+ domain events |
| Performance | ✅ | Caching, retry logic, optimization |

### Statistics

| Metric | Count |
|--------|-------|
| **Domain Entities** | 9 |
| **Enums** | 9 |
| **Use Cases** | 20+ |
| **Controllers** | 5 |
| **Payment Providers** | 4 (Stripe, PayPal, Zarinpal, Custom) |
| **API Endpoints** | 20+ |
| **Domain Events** | 15+ |

The Payment & Financial Infrastructure module is ready for integration with Orders, Cart, and Analytics.
