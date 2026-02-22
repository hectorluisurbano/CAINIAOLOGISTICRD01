export enum TransactionType {
  RECHARGE = 'RECHARGE',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  HOLD = 'HOLD',
  RELEASE = 'RELEASE',
}

export enum Currency {
  USD = 'USD',
  DOP = 'DOP',
  CNY = 'CNY',
}

export enum HoldStatus {
  ACTIVE = 'ACTIVE',
  EXECUTED = 'EXECUTED',
  RELEASED = 'RELEASED',
}

export interface WalletTransactionRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  idempotencyKey?: string;
  referenceId?: string;
}

export interface HoldRequest {
  accountId: string;
  amount: number;
  reason: string;
  referenceId?: string;
  expiresAt?: Date;
}
