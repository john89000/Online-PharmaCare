"use client"

import { useState } from "react"
import { PaymentService } from "@/services/payment-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, CheckCircle, XCircle, Lock } from "lucide-react"

interface StripePaymentProps {
  amount: number
  orderId: string
  onPaymentComplete: (success: boolean, transactionId?: string) => void
}

export function StripePayment({ amount, orderId, onPaymentComplete }: StripePaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "creating" | "processing" | "completed" | "failed">(
    "idle",
  )
  const [paymentIntentId, setPaymentIntentId] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits and add spaces every 4 digits
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (field === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4)
    }

    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }))
  }

  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails

    if (!cardholderName.trim()) return "Cardholder name is required"
    if (cardNumber.replace(/\s/g, "").length < 13) return "Invalid card number"
    if (expiryDate.length !== 5) return "Invalid expiry date"
    if (cvv.length < 3) return "Invalid CVV"

    return null
  }

  const processPayment = async () => {
    const validationError = validateCardDetails()
    if (validationError) {
      setMessage(validationError)
      return
    }

    setPaymentStatus("creating")
    setMessage("")

    try {
      // Create payment intent
      const intentResponse = await PaymentService.createStripePaymentIntent(amount, orderId)

      if (!intentResponse.success || !intentResponse.paymentIntentId) {
        setMessage(intentResponse.error || "Failed to create payment intent")
        setPaymentStatus("failed")
        return
      }

      setPaymentIntentId(intentResponse.paymentIntentId)
      setPaymentStatus("processing")
      setMessage("Processing your payment...")

      // Simulate payment confirmation
      const paymentInfo = await PaymentService.confirmStripePayment(
        intentResponse.paymentIntentId,
        "pm_mock_payment_method",
      )

      if (paymentInfo.status === "completed") {
        setMessage("Payment completed successfully!")
        setPaymentStatus("completed")
        onPaymentComplete(true, paymentInfo.stripePaymentIntentId)
      } else {
        setMessage("Payment failed. Please check your card details and try again.")
        setPaymentStatus("failed")
        onPaymentComplete(false)
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
      setPaymentStatus("failed")
      onPaymentComplete(false)
    }
  }

  const retryPayment = () => {
    setPaymentStatus("idle")
    setMessage("")
    setPaymentIntentId("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
          Card Payment
        </CardTitle>
        <CardDescription>Pay securely with your credit or debit card</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Amount */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount to pay:</span>
            <span className="text-lg font-bold text-blue-600">{formatPrice(amount)}</span>
          </div>
        </div>

        {/* Card Details Form */}
        {paymentStatus === "idle" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={cardDetails.cardholderName}
                onChange={(e) => handleCardInputChange("cardholderName", e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardInputChange("cardNumber", e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleCardInputChange("expiryDate", e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Demo Card Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800 mb-1">Demo Card Numbers:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• 4242 4242 4242 4242 (Visa - Success)</p>
                <p>• 4000 0000 0000 0002 (Visa - Declined)</p>
                <p>• Any future expiry date and 3-digit CVV</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {message && (
          <Alert
            className={
              paymentStatus === "completed"
                ? "border-green-200 bg-green-50"
                : paymentStatus === "failed"
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
            }
          >
            <div className="flex items-center">
              {paymentStatus === "completed" && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
              {paymentStatus === "failed" && <XCircle className="h-4 w-4 text-red-600 mr-2" />}
              {(paymentStatus === "creating" || paymentStatus === "processing") && (
                <Loader2 className="h-4 w-4 text-blue-600 mr-2 animate-spin" />
              )}
              <AlertDescription
                className={
                  paymentStatus === "completed"
                    ? "text-green-800"
                    : paymentStatus === "failed"
                      ? "text-red-800"
                      : "text-blue-800"
                }
              >
                {message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Payment Intent ID */}
        {paymentIntentId && paymentStatus === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Payment ID:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {paymentIntentId}
              </Badge>
            </div>
          </div>
        )}

        {/* Payment Status Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {paymentStatus === "idle" && <Badge variant="secondary">Ready to pay</Badge>}
          {paymentStatus === "creating" && (
            <Badge className="bg-blue-100 text-blue-800">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Creating payment...
            </Badge>
          )}
          {paymentStatus === "processing" && (
            <Badge className="bg-blue-100 text-blue-800">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Processing payment...
            </Badge>
          )}
          {paymentStatus === "completed" && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Payment completed
            </Badge>
          )}
          {paymentStatus === "failed" && (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Payment failed
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {paymentStatus === "idle" && (
            <Button onClick={processPayment} className="w-full bg-blue-600 hover:bg-blue-700">
              <Lock className="h-4 w-4 mr-2" />
              Pay Securely
            </Button>
          )}

          {paymentStatus === "failed" && (
            <Button onClick={retryPayment} variant="outline" className="w-full bg-transparent">
              Try Again
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <div className="text-xs text-muted-foreground text-center bg-gray-50 rounded p-2">
          <Lock className="h-3 w-3 inline mr-1" />
          Your payment information is encrypted and secure
        </div>
      </CardContent>
    </Card>
  )
}
