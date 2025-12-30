export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, normalize, resolve } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    
    // Валидация: запрещаем path traversal атаки
    for (const segment of pathArray) {
      // Запрещаем "..", ".", пустые сегменты и скрытые файлы
      if (segment === ".." || segment === "." || segment === "" || segment.startsWith(".")) {
        return new NextResponse("Invalid path", { status: 400 });
      }
      // Запрещаем специальные символы в путях
      if (/[<>:"|?*\\]/.test(segment)) {
        return new NextResponse("Invalid path characters", { status: 400 });
      }
    }
    
    // Валидация: разрешаем только изображения
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const fileName = pathArray[pathArray.length - 1];
    const extension = fileName?.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return new NextResponse("Invalid file type", { status: 400 });
    }
    
    // Определяем базовую директорию для загрузок
    // UPLOADS_DIR env > /app (Docker) > /tmp (Vercel) > process.cwd() (локально)
    const baseDir = process.env.UPLOADS_DIR || 
      (process.env.VERCEL === "1" ? "/tmp" : null) ||
      (process.env.NODE_ENV === 'production' ? "/app" : null) ||
      process.cwd();
    
    const avatarsBaseDir = resolve(baseDir, "uploads", "avatars");
    const requestedPath = resolve(avatarsBaseDir, ...pathArray);
    
    // Защита от path traversal: проверяем, что итоговый путь внутри базовой директории
    const normalizedBase = normalize(avatarsBaseDir);
    const normalizedPath = normalize(requestedPath);
    if (!normalizedPath.startsWith(normalizedBase)) {
      return new NextResponse("Access denied", { status: 403 });
    }

    if (!existsSync(requestedPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = await readFile(requestedPath);
    
    const contentType: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };

    const mimeType = contentType[extension] || "image/jpeg";

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

