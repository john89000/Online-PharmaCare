export interface NotificationTemplate {
  id: string
  type: NotificationType
  subject: string
  htmlContent: string
  textContent: string
}

export type NotificationType =
  | "order_confirmed"
  | "order_processing"
  | "order_shipped"
  | "order_delivered"
  | "prescription_approved"
  | "prescription_rejected"
  | "payment_completed"
  | "payment_failed"

export interface EmailNotification {
  id: string
  to: string
  subject: string
  content: string
  type: NotificationType
  orderId?: string
  sentAt: string
  status: "sent" | "failed" | "pending"
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  entityType: "order" | "prescription" | "product" | "user"
  entityId: string
  oldValue?: any
  newValue?: any
  timestamp: string
  ipAddress?: string
}
