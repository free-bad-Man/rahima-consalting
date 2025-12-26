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
    // На сервере (Vercel) используем /tmp, локально - uploads
    const isServer = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const baseDir = isServer ? "/tmp" : process.cwd();
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

