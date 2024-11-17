//

import { PrismaClient } from "#prisma/client";
import { PGlite } from "@electric-sql/pglite";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "path";
import { PrismaPGlite } from "pglite-prisma-adapter";

const client = new PGlite();
const adapter = new PrismaPGlite(client);
const prisma = new PrismaClient({ adapter });
const prisma_migration_dir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../prisma/migrations",
);

export default prisma;

//

export async function migrate() {
  const directory = await readdir(prisma_migration_dir);

  for await (const file of directory.sort()) {
    const file_stats = await stat(join(prisma_migration_dir, file));

    if (file_stats.isDirectory()) {
      const filename = join(prisma_migration_dir, file, "migration.sql");
      const migration = await readFile(filename, "utf8");
      await client.exec(migration);
    }
  }
}

export async function empty_database() {
  await client.exec(`DROP SCHEMA public CASCADE;`);
  await client.exec(`CREATE SCHEMA public;`);
}

export async function database_status() {
  console.log("🕵️ DATABASE STATUS");
  console.log({
    exchange_message_notification:
      await prisma.exchangeMessageNotification.count(),
    inbox_message_notification: await prisma.inboxMessageNotification.count(),
    inbox_thread: await prisma.inboxThread.count(),
    notification: await prisma.notification.count(),
    profile_added_notification: await prisma.profileAddedNotification.count(),
    profile: await prisma.profile.count(),
    student: await prisma.student.count(),
    thread: await prisma.thread.count(),
    user: await prisma.user.count(),
  });
}
