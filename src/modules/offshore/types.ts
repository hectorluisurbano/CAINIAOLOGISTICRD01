export enum OffshoreStatus {
  DRAFT = 'DRAFT',
  AWAITING_QUOTATION = 'AWAITING_QUOTATION',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PURCHASE_IN_PROGRESS = 'PURCHASE_IN_PROGRESS',
  QC_PHASE = 'QC_PHASE',
  READY_FOR_CONSOLIDATION = 'READY_FOR_CONSOLIDATION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OffshoreOrderCreate {
  userId: string;
  productInfo: string;
  estimatedQty?: number;
  urls: string[];
}

export interface OffshoreTransition {
  orderId: string;
  toStep: number;
  toStatus: OffshoreStatus;
  notes?: string;
}
