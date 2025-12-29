export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    // Определяем базовую директорию для загрузок
    // UPLOADS_DIR env > /app (Docker) > /tmp (Vercel) > process.cwd() (локально)
    const baseDir = process.env.UPLOADS_DIR || 
      (process.env.VERCEL === "1" ? "/tmp" : null) ||
      (process.env.NODE_ENV === 'production' ? "/app" : null) ||
      process.cwd();
    const filePath = join(baseDir, "uploads", "avatars", ...pathArray);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = await readFile(filePath);
    const extension = filePath.split(".").pop()?.toLowerCase();
    
    const contentType: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };

    const mimeType = contentType[extension || ""] || "image/jpeg";

    return new NextResponse(file, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Avatar serve error:", error);
    return new NextResponse("Error serving file", { status: 500 });
  }
}

