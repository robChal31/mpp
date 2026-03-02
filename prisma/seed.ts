import { prisma } from "../src/server/db/prisma"
import { hashPassword } from "../src/server/auth/password"

async function main() {
  console.log("🌱 Seeding users...")

  const password = await hashPassword("password123")

  // upsert biar aman (ga double insert)
  await prisma.user.upsert({
    where: { email: "school@demo.id" },
    update: {},
    create: {
      email: "school@demo.id",
      name: "Demo School",
      password,
      role: "school",
    },
  })

  await prisma.user.upsert({
    where: { email: "admin@demo.id" },
    update: {},
    create: {
      email: "admin@demo.id",
      name: "Admin MBS",
      password,
      role: "admin",
    },
  })

  console.log("✅ Seeding selesai")
}

main()
  .catch((e) => {
    console.error("❌ Seeder error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
