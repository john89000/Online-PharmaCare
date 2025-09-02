"use client"

import { useState } from "react"
import { PaymentService } from "@/services/payment-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Smartphone, CheckCircle, XCircle, Clock } from "lucide-react"

interface MpesaPaymentProps {
  phone: string
  amount: number
  orderId: string
  onPaymentComplete: (success: boolean, transactionId?: string) => void
}

export function MpesaPayment({ phone, amount, orderId, onPaymentComplete }: MpesaPaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "initiating" | "waiting" | "checking" | "completed" | "failed"
  >("idle")
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [transactionId, setTransactionId] = useState<string>("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  const initiatePayment = async () => {
    setPaymentStatus("initiating")
    setMessage("")

    try {
      const response = await PaymentService.initiateMpesaPayment(phone, amount, orderId)

      if (response.success && response.checkoutRequestId) {
        setCheckoutRequestId(response.checkoutRequestId)
        setMessage(response.customerMessage || "Payment request sent to your phone")
        setPaymentStatus("waiting")

        // Start checking payment status after 10 seconds
        setTimeout(() => {
          checkPaymentStatus(response.checkoutRequestId!)
        }, 10000)
      } else {
        setMessage(response.customerMessage || "Failed to initiate payment")
        setPaymentStatus("failed")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
      setPaymentStatus("failed")
    }
  }

  const checkPaymentStatus = async (requestId: string) => {
    setPaymentStatus("checking")

    try {
      const paymentInfo = await PaymentService.checkMpesaPaymentStatus(requestId)

      if (paymentInfo.status === "completed") {
        setTransactionId(paymentInfo.transactionId || "")
        setMessage("Payment completed successfully!")
        setPaymentStatus("completed")
        onPaymentComplete(true, paymentInfo.transactionId)
      } else {
        setMessage("Payment failed or was cancelled")
        setPaymentStatus("failed")
        onPaymentComplete(false)
      }
    } catch (error) {
      setMessage("Failed to verify payment status")
      setPaymentStatus("failed")
      onPaymentComplete(false)
    }
  }

  const retryPayment = () => {
    setPaymentStatus("idle")
    setMessage("")
    setCheckoutRequestId("")
    setTransactionId("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-green-600" />
          M-Pesa Payment
        </CardTitle>
        <CardDescription>Pay securely using M-Pesa mobile money</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Amount to pay:</span>
            <span className="text-lg font-bold text-green-600">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Phone number:</span>
            <span className="text-sm font-medium">{phone}</span>
          </div>
        </div>

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
              {(paymentStatus === "waiting" || paymentStatus === "checking") && (
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
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

        {/* Transaction ID */}
        {transactionId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Transaction ID:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {transactionId}
              </Badge>
            </div>
          </div>
        )}

        {/* Payment Status Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {paymentStatus === "idle" && <Badge variant="secondary">Ready to pay</Badge>}
          {paymentStatus === "initiating" && (
            <Badge className="bg-blue-100 text-blue-800">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Initiating payment...
            </Badge>
          )}
          {paymentStatus === "waiting" && (
            <Badge className="bg-orange-100 text-orange-800">
              <Clock className="h-3 w-3 mr-1" />
              Waiting for payment...
            </Badge>
          )}
          {paymentStatus === "checking" && (
            <Badge className="bg-blue-100 text-blue-800">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Verifying payment...
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
            <Button onClick={initiatePayment} className="w-full bg-green-600 hover:bg-green-700">
              Pay with M-Pesa
            </Button>
          )}

          {paymentStatus === "waiting" && (
            <Button onClick={() => checkPaymentStatus(checkoutRequestId)} variant="outline" className="w-full">
              Check Payment Status
            </Button>
          )}

          {paymentStatus === "failed" && (
            <Button onClick={retryPayment} variant="outline" className="w-full bg-transparent">
              Try Again
            </Button>
          )}
        </div>

        {/* Instructions */}
        {paymentStatus === "waiting" && (
          <div className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-medium mb-1">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Check your phone for the M-Pesa payment request</li>
              <li>Enter your M-Pesa PIN to authorize the payment</li>
              <li>Wait for payment confirmation</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
