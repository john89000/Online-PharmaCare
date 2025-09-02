import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("[v0] Starting database seed...")

  // Create categories
  const categories = [
    { name: "Pain Relief", description: "Medications for pain management" },
    { name: "Antibiotics", description: "Prescription antibiotics" },
    { name: "Vitamins", description: "Vitamins and supplements" },
    { name: "Cold & Flu", description: "Cold and flu medications" },
    { name: "Digestive Health", description: "Digestive system medications" },
    { name: "Heart Health", description: "Cardiovascular medications" },
    { name: "Diabetes Care", description: "Diabetes management products" },
    { name: "Skin Care", description: "Topical treatments and skin care" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Create sample products
  const products = [
    {
      name: "Paracetamol 500mg",
      description: "Effective pain relief and fever reducer",
      price: 12.99,
      stock: 100,
      category: "Pain Relief",
      manufacturer: "PharmaCorp",
      dosage: "500mg tablets",
      activeIngredient: "Paracetamol",
      requiresPrescription: false,
    },
    {
      name: "Amoxicillin 250mg",
      description: "Broad-spectrum antibiotic for bacterial infections",
      price: 24.99,
      stock: 50,
      category: "Antibiotics",
      manufacturer: "MediLab",
      dosage: "250mg capsules",
      activeIngredient: "Amoxicillin",
      requiresPrescription: true,
    },
    {
      name: "Vitamin D3 1000IU",
      description: "Essential vitamin D supplement",
      price: 18.99,
      discountPrice: 15.99,
      stock: 200,
      category: "Vitamins",
      manufacturer: "HealthPlus",
      dosage: "1000IU tablets",
      activeIngredient: "Cholecalciferol",
      requiresPrescription: false,
    },
    {
      name: "Cough Syrup",
      description: "Soothing cough relief syrup",
      price: 16.99,
      stock: 75,
      category: "Cold & Flu",
      manufacturer: "ColdCare",
      dosage: "200ml bottle",
      activeIngredient: "Dextromethorphan",
      requiresPrescription: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    })
  }

  const demoUsers = [
    {
      email: "admin@pharmacy.com",
      name: "Admin User",
      role: "ADMIN",
      password: "password123",
    },
    {
      email: "customer@example.com",
      name: "John Customer",
      role: "CUSTOMER",
      password: "password123",
      phone: "+1234567890",
    },
    {
      email: "delivery@pharmacy.com",
      name: "Mike Delivery",
      role: "DELIVERY",
      password: "password123",
      phone: "+1987654321",
    },
    {
      email: "staff@pharmacy.com",
      name: "Sarah Staff",
      role: "STAFF",
      password: "password123",
      phone: "+1122334455",
    },
  ]

  for (const userData of demoUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: hashedPassword,
        phone: userData.phone,
      },
    })
  }

  console.log("[v0] Database seeded successfully!")
  console.log("[v0] Demo users created:")
  console.log("  - admin@pharmacy.com (ADMIN)")
  console.log("  - customer@example.com (CUSTOMER)")
  console.log("  - delivery@pharmacy.com (DELIVERY)")
  console.log("  - staff@pharmacy.com (STAFF)")
  console.log("  - All passwords: password123")
}

main()
  .catch((e) => {
    console.error("[v0] Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
