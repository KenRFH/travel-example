import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan dalam form data" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pastikan folder upload di public/uploads ada
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Buat nama file unik
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${originalName}`;
    const filePath = join(uploadDir, filename);

    // Simpan file
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}` 
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Gagal mengunggah gambar" }, { status: 500 });
  }
}
