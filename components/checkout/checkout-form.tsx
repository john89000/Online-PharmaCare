"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { OrderService } from "@/services/payment-service"
import type { Order, OrderItem, ShippingInfo, PaymentInfo } from "@/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertTriangle, MapPin, CreditCard, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface CheckoutFormData {
  // Shipping Information
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string

  // Payment Information
  paymentMethod: "mpesa" | "stripe"
  mpesaPhone?: string

  // Additional Information
  deliveryInstructions: string
  prescriptionFiles: File[]
  agreeToTerms: boolean
}

export function CheckoutForm() {
  const { items, getTotalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    postalCode: "",
    paymentMethod: "mpesa",
    deliveryInstructions: "",
    prescriptionFiles: [],
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalPrice = getTotalPrice()
  const deliveryFee = 200
  const finalTotal = totalPrice + deliveryFee
  const hasPrescriptionItems = items.some((item) => item.product.requiresPrescription)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  const handleInputChange = (field: keyof CheckoutFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, prescriptionFiles: [...prev.prescriptionFiles, ...files] }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prescriptionFiles: prev.prescriptionFiles.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"

    if (formData.paymentMethod === "mpesa" && !formData.mpesaPhone?.trim()) {
      newErrors.mpesaPhone = "M-Pesa phone number is required"
    }

    if (hasPrescriptionItems && formData.prescriptionFiles.length === 0) {
      newErrors.prescriptionFiles = "Prescription files are required for prescription items"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // <CHANGE> Create order with proper structure
      const shippingInfo: ShippingInfo = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode
      }

      const paymentInfo: PaymentInfo = {
        method: formData.paymentMethod,
        status: 'pending',
        amount: finalTotal,
        currency: 'KES',
        mpesaPhone: formData.paymentMethod === 'mpesa' ? formData.mpesaPhone : undefined
      }

      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        quantity: item.quantity,
        price: item.product.price,
        requiresPrescription: item.product.requiresPrescription
      }))

      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user!.id,
        items: orderItems,
        shippingInfo,
        paymentInfo,
        status: 'pending',
        totalAmount: totalPrice,
        deliveryFee,
        finalTotal,
        deliveryInstructions: formData.deliveryInstructions || undefined,
        prescriptionFiles: formData.prescriptionFiles.map(file => file.name)
      }

      const order = await OrderService.createOrder(orderData)
      
      // Redirect to payment page
      router.push(`/payment/${order.id}`)
    } catch (error) {
      console.error("Order creation failed:", error)
      alert("Failed to create order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Information
              </CardTitle>
              <CardDescription>Where should we deliver your order?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+254700000000"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                <Textarea
                  id="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={(e) => handleInputChange("deliveryInstructions", e.target.value)}
                  placeholder="Any special instructions for delivery..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: "mpesa" | "stripe") => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="stripe">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>

              {formData.paymentMethod === "mpesa" && (
                <div>
                  <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                  <Input
                    id="mpesaPhone"
                    value={formData.mpesaPhone || ""}
                    onChange={(e) => handleInputChange("mpesaPhone", e.target.value)}
                    placeholder="+254700000000"
                    className={errors.mpesaPhone ? "border-red-500" : ""}
                  />
                  {errors.mpesaPhone && <p className="text-sm text-red-600 mt-1">{errors.mpesaPhone}</p>}
                  <p className="text-sm text-muted-foreground mt-1">
                    You will receive an M-Pesa prompt to complete payment
                  </p>
                </div>
              )}

              {formData.paymentMethod === "stripe" && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Card payment will be processed securely through Stripe during checkout.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Prescription Upload */}
          {hasPrescriptionItems && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Prescription Upload
                </CardTitle>
                <CardDescription>Upload valid prescriptions for prescription items in your cart</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prescriptions">Upload Prescription Files</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {errors.prescriptionFiles && <p className="text-sm text-red-600 mt-1">{errors.prescriptionFiles}</p>}
                </div>

                {formData.prescriptionFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files:</Label>
                    {formData.prescriptionFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm\
