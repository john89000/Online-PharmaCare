export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  shippingInfo: ShippingInfo
  paymentInfo: PaymentInfo
  status: OrderStatus
  totalAmount: number
  deliveryFee: number
  finalTotal: number
  createdAt: string
  updatedAt: string
  prescriptionFiles?: string[]
  deliveryInstructions?: string
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  requiresPrescription: boolean
}

export interface ShippingInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export interface PaymentInfo {
  method: "mpesa" | "stripe"
  status: PaymentStatus
  transactionId?: string
  mpesaPhone?: string
  stripePaymentIntentId?: string
  amount: number
  currency: string
  paidAt?: string
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "cancelled"
