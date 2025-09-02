"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { PrescriptionService } from "@/services/prescription-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import type { PrescriptionFile } from "@/types/prescription"

export function PrescriptionManagement() {
  const { user } = useAuth()
  const [prescriptions, setPrescriptions] = useState<PrescriptionFile[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionFile | null>(null)
  const [validationForm, setValidationForm] = useState({
    isValid: true,
    doctorName: "",
    licenseNumber: "",
    expiryDate: "",
    rejectionReason: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = () => {
    const pendingPrescriptions = PrescriptionService.getPendingPrescriptions()
    setPrescriptions(pendingPrescriptions)
  }

  const handleValidation = async () => {
    if (!selectedPrescription || !user) return

    setIsSubmitting(true)
    try {
      await PrescriptionService.validatePrescription(selectedPrescription.id, validationForm, user.id, user.name)

      // Refresh prescriptions list
      loadPrescriptions()

      // Reset form
      setSelectedPrescription(null)
      setValidationForm({
        isValid: true,
        doctorName: "",
        licenseNumber: "",
        expiryDate: "",
        rejectionReason: "",
      })
    } catch (error) {
      console.error("Failed to validate prescription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Prescription Validation ({prescriptions.length} pending)
        </CardTitle>
        <CardDescription>Review and validate customer prescription uploads</CardDescription>
      </CardHeader>
      <CardContent>
        {prescriptions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending prescriptions to review</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">{prescription.orderId}</TableCell>
                  <TableCell>{prescription.fileName}</TableCell>
                  <TableCell>{formatFileSize(prescription.fileSize)}</TableCell>
                  <TableCell>{formatDate(prescription.uploadedAt)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(prescription.status)} flex items-center space-x-1 w-fit`}>
                      {getStatusIcon(prescription.status)}
                      <span className="capitalize">{prescription.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(prescription)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Prescription Validation</DialogTitle>
                          <DialogDescription>
                            Review and validate prescription for order {selectedPrescription?.orderId}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedPrescription && (
                          <div className="space-y-6">
                            {/* Prescription Details */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                              <div>
                                <Label className="text-sm font-medium">File Name</Label>
                                <p className="text-sm">{selectedPrescription.fileName}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">File Size</Label>
                                <p className="text-sm">{formatFileSize(selectedPrescription.fileSize)}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Order ID</Label>
                                <p className="text-sm">{selectedPrescription.orderId}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Uploaded</Label>
                                <p className="text-sm">{formatDate(selectedPrescription.uploadedAt)}</p>
                              </div>
                            </div>

                            {/* Validation Form */}
                            <div className="space-y-4">
                              <div>
                                <Label>Validation Decision</Label>
                                <Select
                                  value={validationForm.isValid ? "approve" : "reject"}
                                  onValueChange={(value) =>
                                    setValidationForm((prev) => ({ ...prev, isValid: value === "approve" }))
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="approve">Approve Prescription</SelectItem>
                                    <SelectItem value="reject">Reject Prescription</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {validationForm.isValid ? (
                                <>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="doctorName">Doctor Name</Label>
                                      <Input
                                        id="doctorName"
                                        value={validationForm.doctorName}
                                        onChange={(e) =>
                                          setValidationForm((prev) => ({ ...prev, doctorName: e.target.value }))
                                        }
                                        placeholder="Dr. John Smith"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="licenseNumber">License Number</Label>
                                      <Input
                                        id="licenseNumber"
                                        value={validationForm.licenseNumber}
                                        onChange={(e) =>
                                          setValidationForm((prev) => ({ ...prev, licenseNumber: e.target.value }))
                                        }
                                        placeholder="LIC123456"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="expiryDate">Prescription Expiry Date</Label>
                                    <Input
                                      id="expiryDate"
                                      type="date"
                                      value={validationForm.expiryDate}
                                      onChange={(e) =>
                                        setValidationForm((prev) => ({ ...prev, expiryDate: e.target.value }))
                                      }
                                    />
                                  </div>
                                </>
                              ) : (
                                <div>
                                  <Label htmlFor="rejectionReason">Rejection Reason</Label>
                                  <Textarea
                                    id="rejectionReason"
                                    value={validationForm.rejectionReason}
                                    onChange={(e) =>
                                      setValidationForm((prev) => ({ ...prev, rejectionReason: e.target.value }))
                                    }
                                    placeholder="Please provide a reason for rejection..."
                                    rows={3}
                                  />
                                </div>
                              )}

                              <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setSelectedPrescription(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleValidation}
                                  disabled={isSubmitting}
                                  className={
                                    validationForm.isValid
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-red-600 hover:bg-red-700"
                                  }
                                >
                                  {isSubmitting ? "Processing..." : validationForm.isValid ? "Approve" : "Reject"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
