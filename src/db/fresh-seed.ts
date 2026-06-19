import "dotenv/config";
import { db } from "./drizzle";
import { admins, carTypes, routes, schedules } from "./schema";

async function freshSeed() {
  console.log("Menghapus seluruh isi tabel di database Turso...");
  try {
    // Hapus data (urutan foreign key dari dependent ke parent)
    await db.delete(schedules);
    console.log("✔ Berhasil menghapus semua data jadwal (schedules).");
    
    await db.delete(routes);
    console.log("✔ Berhasil menghapus semua data rute (routes).");
    
    await db.delete(carTypes);
    console.log("✔ Berhasil menghapus semua data tipe kendaraan (carTypes).");
    
    await db.delete(admins);
    console.log("✔ Berhasil menghapus semua data admin.");

    console.log("Memulai seeding akun admin default...");
    await db.insert(admins).values({
      username: "admin",
      password: "jembertravel2026",
    });
    console.log("✔ Berhasil menambahkan akun admin default.");
    console.log("Database Turso berhasil di-reset bersih (fresh seed)!");
  } catch (error) {
    console.error("❌ Gagal melakukan fresh seed:", error);
  }
}

freshSeed();
