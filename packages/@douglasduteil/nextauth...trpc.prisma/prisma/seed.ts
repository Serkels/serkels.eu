/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import process from "node:process";
import { PrismaClient } from "../prisma/.client";

const prisma = new PrismaClient();

async function main() {
  // Add stuff
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
