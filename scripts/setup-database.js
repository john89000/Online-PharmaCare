const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔧 Setting up database...")

try {
  // Check if dev.db exists
  const dbPath = path.join(process.cwd(), "dev.db")
  const dbExists = fs.existsSync(dbPath)

  console.log(`📁 Database file exists: ${dbExists}`)

  // Generate Prisma client
  console.log("📦 Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Run migrations
  console.log("🔄 Running database migrations...")
  execSync("npx prisma migrate dev --name init", { stdio: "inherit" })

  // Seed database
  console.log("🌱 Seeding database...")
  execSync("node scripts/seed-database.js", { stdio: "inherit" })

  console.log("✅ Database setup complete!")
  console.log("🚀 You can now start the development server with: npm run dev")
} catch (error) {
  console.error("❌ Database setup failed:", error.message)
  process.exit(1)
}
