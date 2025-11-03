const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

async function createAdmin() {
  const email = "admin@example.com";
  const plainPassword = "Admin123!";
  const firstName = "Admin";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.users.create({
    data: {
      email,
      firstName,
      password: hashedPassword,
      role: "ADMIN",
      phone: null,
    },
  });

  console.log("Admin created:", admin);
}

createAdmin().catch(console.error);
