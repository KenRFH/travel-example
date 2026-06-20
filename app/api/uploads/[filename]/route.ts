import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    let fileBuffer: Buffer;
    let resolvedFilename = filename;
    
    try {
      // 1. Coba baca dari /tmp
      const filePath = join("/tmp", filename);
      fileBuffer = await readFile(filePath);
    } catch (tmpError) {
      try {
        // 2. Coba baca dari public/uploads (local upload directory)
        const filePath = join(process.cwd(), "public", "uploads", filename);
        fileBuffer = await readFile(filePath);
      } catch (uploadError) {
        // 3. Fallback darurat: Jika file hilang (misal /tmp terhapus di macOS/Vercel)
        // Cari kemiripan nama file untuk menentukan gambar default
        let fallbackName = "interior-van.jpg";
        const lowerName = filename.toLowerCase();
        
        if (lowerName.includes("hiace")) {
          fallbackName = "toyota-hiace.jpg";
        } else if (lowerName.includes("innova")) {
          fallbackName = "toyota-innova.jpg";
        } else if (lowerName.includes("banyuwangi")) {
          fallbackName = "banyuwangi1.jpg";
        } else if (lowerName.includes("malang")) {
          fallbackName = "malang1.jpg";
        } else if (lowerName.includes("surabaya")) {
          fallbackName = "surabaya1.jpg";
        }
        
        resolvedFilename = fallbackName;
        const filePath = join(process.cwd(), "public", "images", fallbackName);
        fileBuffer = await readFile(filePath);
      }
    }

    // Tentukan Content-Type berdasarkan ekstensi file yang berhasil di-load
    const ext = resolvedFilename.split(".").pop()?.toLowerCase() || "";
    let contentType = "image/jpeg";
    if (ext === "png") contentType = "image/png";
    else if (ext === "webp") contentType = "image/webp";
    else if (ext === "gif") contentType = "image/gif";
    else if (ext === "svg") contentType = "image/svg+xml";

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return new Response("File tidak ditemukan", { status: 404 });
  }
}
