import type { PaymentInfo, Order, OrderStatus } from "@/types/order"
import { NotificationService } from "./notification-service"
import { AuditService } from "./audit-service"

// Mock M-Pesa STK Push Response
interface MpesaSTKResponse {
  success: boolean
  checkoutRequestId?: string
  responseCode?: string
  responseDescription?: string
  customerMessage?: string
}

// Mock Stripe Payment Intent Response
interface StripePaymentResponse {
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  status?: string
  error?: string
}

export class PaymentService {
  // M-Pesa STK Push simulation
  static async initiateMpesaPayment(phone: string, amount: number, orderId: string): Promise<MpesaSTKResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock successful response (90% success rate)
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      return {
        success: true,
        checkoutRequestId: `ws_CO_${Date.now()}`,
        responseCode: "0",
        responseDescription: "Success. Request accepted for processing",
        customerMessage: `A payment request has been sent to ${phone}. Please enter your M-Pesa PIN to complete the transaction.`,
      }
    } else {
      return {
        success: false,
        responseCode: "1",
        responseDescription: "Request failed",
        customerMessage: "Payment request failed. Please try again.",
      }
    }
  }

  // Check M-Pesa payment status simulation
  static async checkMpesaPaymentStatus(checkoutRequestId: string): Promise<PaymentInfo> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock payment completion (80% success rate after STK push)
    const isCompleted = Math.random() > 0.2

    if (isCompleted) {
      return {
        method: "mpesa",
        status: "completed",
        transactionId: `MP${Date.now()}`,
        amount: 0, // Will be set by caller
        currency: "KES",
        paidAt: new Date().toISOString(),
      }
    } else {
      return {
        method: "mpesa",
        status: "failed",
        amount: 0,
        currency: "KES",
      }
    }
  }

  // Stripe payment simulation
  static async createStripePaymentIntent(amount: number, orderId: string): Promise<StripePaymentResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful payment intent creation
    const isSuccess = Math.random() > 0.05 // 95% success rate

    if (isSuccess) {
      return {
        success: true,
        paymentIntentId: `pi_${Date.now()}`,
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        status: "requires_payment_method",
      }
    } else {
      return {
        success: false,
        error: "Failed to create payment intent",
      }
    }
  }

  // Confirm Stripe payment simulation
  static async confirmStripePayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentInfo> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock payment confirmation (90% success rate)
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      return {
        method: "stripe",
        status: "completed",
        stripePaymentIntentId: paymentIntentId,
        amount: 0, // Will be set by caller
        currency: "KES",
        paidAt: new Date().toISOString(),
      }
    } else {
      return {
        method: "stripe",
        status: "failed",
        amount: 0,
        currency: "KES",
      }
    }
  }
}

// Order creation service
export class OrderService {
  static async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const order: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store in localStorage for demo purposes
    const existingOrders = JSON.parse(localStorage.getItem("pharmacy_orders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("pharmacy_orders", JSON.stringify(existingOrders))

    return order
  }

  static async getOrders(): Promise<Order[]> {
    try {
      const raw = localStorage.getItem("pharmacy_orders") || "[]"
      const orders = JSON.parse(raw) as Order[]
      return orders
    } catch (e) {
      return []
    }
  }

  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    userId?: string,
    userName?: string,
  ): Promise<void> {
    const orders = JSON.parse(localStorage.getItem("pharmacy_orders") || "[]")
    const orderIndex = orders.findIndex((order: Order) => order.id === orderId)

    if (orderIndex !== -1) {
      const oldStatus = orders[orderIndex].status
      orders[orderIndex].status = status
      orders[orderIndex].updatedAt = new Date().toISOString()
      localStorage.setItem("pharmacy_orders", JSON.stringify(orders))

      const order = orders[orderIndex]

      // Send notification for status change
      await NotificationService.sendOrderStatusNotification(order, status)

      // Log audit trail if user info provided
      if (userId && userName) {
        await AuditService.logOrderStatusChange(userId, userName, orderId, oldStatus, status)
      }
    }
  }
}
