// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Function to return a new extended Prisma instance
const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

// Extract the return type of the extended client
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Augment TypeScript global scope
declare global {
  var prismaGlobal: PrismaClientSingleton | undefined;
}

// Reuse global instance if present, or create a new extended instance
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Cache the instance in global scope during local development
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}