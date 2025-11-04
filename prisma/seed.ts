import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      firstName: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Admin user created!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
