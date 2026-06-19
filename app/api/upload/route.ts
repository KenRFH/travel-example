import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  let file: File | null = null;
  try {
    const formData = await request.formData();
    file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan dalam form data" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan folder upload (gunakan /tmp di Vercel Serverless)
    const isVercel = !!process.env.VERCEL || process.env.NODE_ENV === "production";
    const uploadDir = isVercel 
      ? "/tmp" 
      : join(process.cwd(), "public", "uploads");

    // Pastikan folder ada
    await mkdir(uploadDir, { recursive: true });

    // Buat nama file unik
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${originalName}`;
    const filePath = join(uploadDir, filename);

    // Simpan file
    await writeFile(filePath, buffer);

    // Kembalikan URL yang sesuai
    const fileUrl = isVercel 
      ? `/api/uploads/${filename}` 
      : `/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl 
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    
    // Fallback darurat ke /tmp jika terjadi error mkdir/write (misal read-only filesystem)
    if (file) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${uniqueSuffix}-${originalName}`;
        
        const tmpPath = join("/tmp", filename);
        await writeFile(tmpPath, buffer);
        
        return NextResponse.json({ 
          success: true, 
          url: `/api/uploads/${filename}` 
        });
      } catch (fallbackError: any) {
        console.error("Emergency fallback upload failed:", fallbackError);
      }
    }
    
    return NextResponse.json({ error: error.message || "Gagal mengunggah gambar" }, { status: 500 });
  }
}
