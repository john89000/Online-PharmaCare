import type { PrescriptionFile, PrescriptionStatus, PrescriptionValidation } from "@/types/prescription"
import type { Order } from "@/types/order"
import { NotificationService } from "./notification-service"
import { AuditService } from "./audit-service"

export class PrescriptionService {
  // Create prescription file record
  static async createPrescriptionFile(orderId: string, fileName: string, fileSize: number): Promise<PrescriptionFile> {
    const prescriptionFile: PrescriptionFile = {
      id: `PRESC-${Date.now()}`,
      orderId,
      fileName,
      fileSize,
      uploadedAt: new Date().toISOString(),
      status: "pending",
    }

    // Store prescription file
    const prescriptions = JSON.parse(localStorage.getItem("pharmacy_prescriptions") || "[]")
    prescriptions.push(prescriptionFile)
    localStorage.setItem("pharmacy_prescriptions", JSON.stringify(prescriptions))

    return prescriptionFile
  }

  // Validate prescription
  static async validatePrescription(
    prescriptionId: string,
    validation: Omit<PrescriptionValidation, "validatedAt">,
    validatorUserId: string,
    validatorName: string,
  ): Promise<void> {
    const prescriptions = JSON.parse(localStorage.getItem("pharmacy_prescriptions") || "[]")
    const prescriptionIndex = prescriptions.findIndex((p: PrescriptionFile) => p.id === prescriptionId)

    if (prescriptionIndex === -1) {
      throw new Error("Prescription not found")
    }

    const prescription = prescriptions[prescriptionIndex]
    const newStatus: PrescriptionStatus = validation.isValid ? "approved" : "rejected"

    // Update prescription
    prescriptions[prescriptionIndex] = {
      ...prescription,
      status: newStatus,
      validatedBy: validatorName,
      validatedAt: new Date().toISOString(),
      doctorName: validation.doctorName,
      licenseNumber: validation.licenseNumber,
      expiryDate: validation.expiryDate,
      rejectionReason: validation.rejectionReason,
    }

    localStorage.setItem("pharmacy_prescriptions", JSON.stringify(prescriptions))

    // Get associated order
    const orders = JSON.parse(localStorage.getItem("pharmacy_orders") || "[]")
    const order = orders.find((o: Order) => o.id === prescription.orderId)

    if (order) {
      // Send notification
      await NotificationService.sendPrescriptionNotification(
        order,
        validation.isValid ? "approved" : "rejected",
        validation.rejectionReason,
      )

      // Log audit trail
      await AuditService.logPrescriptionValidation(
        validatorUserId,
        validatorName,
        order.id,
        prescriptionId,
        validation.isValid ? "approved" : "rejected",
        validation.rejectionReason,
      )
    }
  }

  // Get prescriptions for order
  static getPrescriptionsForOrder(orderId: string): PrescriptionFile[] {
    const prescriptions = JSON.parse(localStorage.getItem("pharmacy_prescriptions") || "[]")
    return prescriptions.filter((p: PrescriptionFile) => p.orderId === orderId)
  }

  // Get all pending prescriptions
  static getPendingPrescriptions(): PrescriptionFile[] {
    const prescriptions = JSON.parse(localStorage.getItem("pharmacy_prescriptions") || "[]")
    return prescriptions.filter((p: PrescriptionFile) => p.status === "pending")
  }
}
