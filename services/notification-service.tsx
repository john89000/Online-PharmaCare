import type { NotificationType, EmailNotification, NotificationTemplate } from "@/types/notification"
import type { Order } from "@/types/order"

// Email templates for different notification types
const emailTemplates: Record<NotificationType, NotificationTemplate> = {
  order_confirmed: {
    id: "order_confirmed",
    type: "order_confirmed",
    subject: "Order Confirmed - #{orderId}",
    htmlContent: `
      <h2>Your order has been confirmed!</h2>
      <p>Dear {customerName},</p>
      <p>Thank you for your order. We have received your payment and your order is now being processed.</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li>Order ID: {orderId}</li>
        <li>Total: {totalAmount}</li>
        <li>Items: {itemCount} items</li>
      </ul>
      <p>You can track your order status at any time by visiting your account.</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent: "Your order #{orderId} has been confirmed. Total: {totalAmount}. Track your order in your account.",
  },
  order_processing: {
    id: "order_processing",
    type: "order_processing",
    subject: "Order Processing - #{orderId}",
    htmlContent: `
      <h2>Your order is being processed</h2>
      <p>Dear {customerName},</p>
      <p>Your order #{orderId} is now being prepared for shipment.</p>
      <p>We'll notify you once your order has been shipped.</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent: "Your order #{orderId} is being processed and will be shipped soon.",
  },
  order_shipped: {
    id: "order_shipped",
    type: "order_shipped",
    subject: "Order Shipped - #{orderId}",
    htmlContent: `
      <h2>Your order has been shipped!</h2>
      <p>Dear {customerName},</p>
      <p>Great news! Your order #{orderId} has been shipped and is on its way to you.</p>
      <p><strong>Delivery Address:</strong><br>{shippingAddress}</p>
      <p>Expected delivery: 1-3 business days</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent: "Your order #{orderId} has been shipped! Expected delivery: 1-3 business days.",
  },
  order_delivered: {
    id: "order_delivered",
    type: "order_delivered",
    subject: "Order Delivered - #{orderId}",
    htmlContent: `
      <h2>Your order has been delivered!</h2>
      <p>Dear {customerName},</p>
      <p>Your order #{orderId} has been successfully delivered.</p>
      <p>We hope you're satisfied with your purchase. If you have any questions or concerns, please don't hesitate to contact us.</p>
      <p>Thank you for choosing our pharmacy!</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent: "Your order #{orderId} has been delivered! Thank you for choosing our pharmacy.",
  },
  prescription_approved: {
    id: "prescription_approved",
    type: "prescription_approved",
    subject: "Prescription Approved - Order #{orderId}",
    htmlContent: `
      <h2>Your prescription has been approved</h2>
      <p>Dear {customerName},</p>
      <p>Your prescription for order #{orderId} has been reviewed and approved by our licensed pharmacist.</p>
      <p>Your order will now proceed to processing and shipment.</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent: "Your prescription for order #{orderId} has been approved and your order will proceed to processing.",
  },
  prescription_rejected: {
    id: "prescription_rejected",
    type: "prescription_rejected",
    subject: "Prescription Requires Attention - Order #{orderId}",
    htmlContent: `
      <h2>Prescription requires attention</h2>
      <p>Dear {customerName},</p>
      <p>We were unable to approve the prescription for order #{orderId}.</p>
      <p><strong>Reason:</strong> {rejectionReason}</p>
      <p>Please contact us or upload a new prescription to proceed with your order.</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent:
      "Your prescription for order #{orderId} requires attention. Reason: {rejectionReason}. Please contact us.",
  },
  payment_completed: {
    id: "payment_completed",
    type: "payment_completed",
    subject: "Payment Received - Order #{orderId}",
    htmlContent: `
      <h2>Payment received successfully</h2>
      <p>Dear {customerName},</p>
      <p>We have successfully received your payment for order #{orderId}.</p>
      <p><strong>Payment Details:</strong></p>
      <ul>
        <li>Amount: {totalAmount}</li>
        <li>Method: {paymentMethod}</li>
        <li>Transaction ID: {transactionId}</li>
      </ul>
      <p>Your order will now be processed.</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent: "Payment received for order #{orderId}. Amount: {totalAmount}. Your order will now be processed.",
  },
  payment_failed: {
    id: "payment_failed",
    type: "payment_failed",
    subject: "Payment Failed - Order #{orderId}",
    htmlContent: `
      <h2>Payment could not be processed</h2>
      <p>Dear {customerName},</p>
      <p>We were unable to process the payment for order #{orderId}.</p>
      <p>Please try again or contact us for assistance.</p>
      <p>Best regards,<br>Your Pharmacy Team</p>
    `,
    textContent: "Payment failed for order #{orderId}. Please try again or contact us for assistance.",
  },
}

export class NotificationService {
  // Send email notification
  static async sendEmailNotification(
    type: NotificationType,
    recipientEmail: string,
    data: Record<string, any>,
  ): Promise<EmailNotification> {
    const template = emailTemplates[type]

    // Replace placeholders in template
    let subject = template.subject
    let content = template.htmlContent

    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      subject = subject.replace(new RegExp(placeholder, "g"), String(value))
      content = content.replace(new RegExp(placeholder, "g"), String(value))
    })

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const notification: EmailNotification = {
      id: `EMAIL-${Date.now()}`,
      to: recipientEmail,
      subject,
      content,
      type,
      orderId: data.orderId,
      sentAt: new Date().toISOString(),
      status: Math.random() > 0.1 ? "sent" : "failed", // 90% success rate
    }

    // Store notification in localStorage
    const notifications = JSON.parse(localStorage.getItem("pharmacy_notifications") || "[]")
    notifications.push(notification)
    localStorage.setItem("pharmacy_notifications", JSON.stringify(notifications))

    return notification
  }

  // Send order status notification
  static async sendOrderStatusNotification(order: Order, newStatus: string): Promise<void> {
    const notificationTypes: Record<string, NotificationType> = {
      confirmed: "order_confirmed",
      processing: "order_processing",
      shipped: "order_shipped",
      delivered: "order_delivered",
    }

    const notificationType = notificationTypes[newStatus]
    if (!notificationType) return

    const data = {
      orderId: order.id,
      customerName: order.shippingInfo.fullName,
      totalAmount: new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(order.finalTotal),
      itemCount: order.items.length,
      shippingAddress: `${order.shippingInfo.address}, ${order.shippingInfo.city}`,
      paymentMethod: order.paymentInfo.method.toUpperCase(),
      transactionId: order.paymentInfo.transactionId || "N/A",
    }

    await this.sendEmailNotification(notificationType, order.shippingInfo.email, data)
  }

  // Send prescription status notification
  static async sendPrescriptionNotification(
    order: Order,
    status: "approved" | "rejected",
    rejectionReason?: string,
  ): Promise<void> {
    const notificationType = status === "approved" ? "prescription_approved" : "prescription_rejected"

    const data = {
      orderId: order.id,
      customerName: order.shippingInfo.fullName,
      rejectionReason: rejectionReason || "",
    }

    await this.sendEmailNotification(notificationType, order.shippingInfo.email, data)
  }

  // Get notification history
  static getNotificationHistory(): EmailNotification[] {
    return JSON.parse(localStorage.getItem("pharmacy_notifications") || "[]")
  }
}
