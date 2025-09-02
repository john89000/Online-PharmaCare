export interface PrescriptionFile {
  id: string
  orderId: string
  fileName: string
  fileSize: number
  uploadedAt: string
  status: PrescriptionStatus
  validatedBy?: string
  validatedAt?: string
  rejectionReason?: string
  expiryDate?: string
  doctorName?: string
  licenseNumber?: string
}

export type PrescriptionStatus = "pending" | "approved" | "rejected" | "expired"

export interface PrescriptionValidation {
  fileId: string
  isValid: boolean
  doctorName?: string
  licenseNumber?: string
  expiryDate?: string
  rejectionReason?: string
  validatedBy: string
  validatedAt: string
}
