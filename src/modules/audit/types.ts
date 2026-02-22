export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  SECURITY = 'SECURITY',
}

export interface AuditLogCreate {
  userId?: string;
  action: string;
  severity?: AuditSeverity;
  entity?: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditFilter {
  userId?: string;
  severity?: AuditSeverity;
  entity?: string;
  startDate?: Date;
  endDate?: Date;
}
