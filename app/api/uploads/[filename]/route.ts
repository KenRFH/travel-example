import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join("/tmp", filename);
    const fileBuffer = await readFile(filePath);

    // Tentukan Content-Type berdasarkan ekstensi file
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    let contentType = "image/jpeg";
    if (ext === "png") contentType = "image/png";
    else if (ext === "webp") contentType = "image/webp";
    else if (ext === "gif") contentType = "image/gif";
    else if (ext === "svg") contentType = "image/svg+xml";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file from /tmp:", error);
    return new Response("File tidak ditemukan", { status: 404 });
  }
}
