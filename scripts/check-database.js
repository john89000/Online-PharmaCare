const { PrismaClient } = require("@prisma/client")

async function checkDatabase() {
  const prisma = new PrismaClient()

  try {
    console.log("🔍 Checking database connection...")

    // Test connection
    await prisma.$connect()
    console.log("✅ Database connection successful")

    // Check if users exist
    const userCount = await prisma.user.count()
    console.log(`👥 Users in database: ${userCount}`)

    if (userCount === 0) {
      console.log("⚠️  No users found. Run: npm run db:seed")
    } else {
      // List demo users
      const users = await prisma.user.findMany({
        select: { email: true, role: true },
      })
      console.log("📋 Demo users:")
      users.forEach((user) => {
        console.log(`  - ${user.email} (${user.role})`)
      })
    }
  } catch (error) {
    console.error("❌ Database check failed:", error.message)
    console.log("💡 Try running: npm run db:setup")
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
