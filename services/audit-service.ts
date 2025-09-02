import type { AuditLog } from "@/types/notification"

export class AuditService {
  // Log an action
  static async logAction(
    userId: string,
    userName: string,
    action: string,
    entityType: "order" | "prescription" | "product" | "user",
    entityId: string,
    oldValue?: any,
    newValue?: any,
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: `AUDIT-${Date.now()}`,
      userId,
      userName,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1", // In real app, get from request
    }

    // Store audit log
    const auditLogs = JSON.parse(localStorage.getItem("pharmacy_audit_logs") || "[]")
    auditLogs.push(auditLog)
    localStorage.setItem("pharmacy_audit_logs", JSON.stringify(auditLogs))
  }

  // Get audit logs
  static getAuditLogs(entityType?: string, entityId?: string): AuditLog[] {
    const logs = JSON.parse(localStorage.getItem("pharmacy_audit_logs") || "[]")

    if (entityType && entityId) {
      return logs.filter((log: AuditLog) => log.entityType === entityType && log.entityId === entityId)
    }

    if (entityType) {
      return logs.filter((log: AuditLog) => log.entityType === entityType)
    }

    return logs
  }

  // Log order status change
  static async logOrderStatusChange(
    userId: string,
    userName: string,
    orderId: string,
    oldStatus: string,
    newStatus: string,
  ): Promise<void> {
    await this.logAction(
      userId,
      userName,
      `Order status changed from ${oldStatus} to ${newStatus}`,
      "order",
      orderId,
      { status: oldStatus },
      { status: newStatus },
    )
  }

  // Log prescription validation
  static async logPrescriptionValidation(
    userId: string,
    userName: string,
    orderId: string,
    prescriptionId: string,
    status: "approved" | "rejected",
    reason?: string,
  ): Promise<void> {
    await this.logAction(
      userId,
      userName,
      `Prescription ${status}${reason ? `: ${reason}` : ""}`,
      "prescription",
      prescriptionId,
      { status: "pending" },
      { status, reason },
    )
  }
}
