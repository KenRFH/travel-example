import { db } from "./drizzle";
import { admins } from "./schema";

export async function seedDatabase() {
  // 1. Seed Admin
  try {
    const existingAdmins = await db.select().from(admins).limit(1);
    if (existingAdmins.length === 0) {
      console.log("Seeding default admin account...");
      await db.insert(admins).values({
        username: "admin",
        password: "jembertravel2026",
      });
    }
  } catch (error) {
    console.log("Admin account seed skipped or already exists.");
  }
}
