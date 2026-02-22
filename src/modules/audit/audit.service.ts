import { AuditLogCreate, AuditFilter, AuditSeverity } from "./types";

export class AuditService {
  /**
   * Registra una nueva acción en el log de auditoría (Inmutable).
   */
  public async logAction(data: AuditLogCreate): Promise<void> {
    const timestamp = new Date();
    console.log(`[AuditService] [${data.severity || AuditSeverity.INFO}] Action: ${data.action}`, {
      userId: data.userId,
      entity: data.entity,
      traceId: data.traceId,
      timestamp,
    });

    // Aquí iría la persistencia real vía Prisma:
    // await prisma.auditLog.create({ data: { ...data, timestamp } });
  }

  /**
   * Obtiene logs aplicando filtros de visibilidad por rol.
   * USER: Solo sus propios logs.
   * AGENT: Sus logs + clientes asignados (simplificado aquí).
   * ADMIN: Todos.
   */
  public async getLogs(filter: AuditFilter, userRole: string, currentUserId: string): Promise<Record<string, unknown>[]> {
    console.log(`[AuditService] Fetching logs for role ${userRole}`);

    // Lógica de filtrado por RBAC
    const finalFilter = { ...filter };

    if (userRole === 'USER') {
      finalFilter.userId = currentUserId;
    }

    // Simulación de retorno
    return [
      {
        id: "log_1",
        action: "login",
        userId: currentUserId,
        severity: AuditSeverity.INFO,
        timestamp: new Date(),
      }
    ];
  }

  /**
   * Exporta logs a formato JSON.
   */
  public async exportLogs(logs: Record<string, unknown>[]): Promise<string> {
    return JSON.stringify(logs, null, 2);
  }
}

export const auditService = new AuditService();
