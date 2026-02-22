export enum WarehouseStatus {
  PENDING_RECEIPT = 'PENDING_RECEIPT',
  RECEIVED = 'RECEIVED',
  CONSOLIDATED = 'CONSOLIDATED',
  SHIPPED = 'SHIPPED',
  DISCARDED = 'DISCARDED',
}

export enum ContainerType {
  LCL = 'LCL',
  FCL = 'FCL',
}

export interface WarehouseItemReception {
  userId: string;
  description: string;
  photos: string[];
  weight: number;
  dimensions: { l: number; w: number; h: number };
  batchId?: string;
  expiryDate?: Date;
}

export interface ConsolidationRequest {
  userId: string;
  itemIds: string[];
  serviceType: string;
}
