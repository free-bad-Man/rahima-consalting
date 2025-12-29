export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 }
      );
    }

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { 
          error: `Файл должен быть изображением. Загружен файл типа: ${file.type || "неизвестный"}, размер: ${fileSizeMB} MB` 
        },
        { status: 400 }
      );
    }

    // Проверка размера (макс 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { 
          error: `Размер файла превышает допустимый лимит. Размер файла: ${fileSizeMB} MB, максимальный размер: 5 MB` 
        },
        { status: 400 }
      );
    }

    // Определяем базовую директорию для загрузок
    // UPLOADS_DIR env > /app (Docker) > /tmp (Vercel) > process.cwd() (локально)
    const baseDir = process.env.UPLOADS_DIR || 
      (process.env.VERCEL === "1" ? "/tmp" : null) ||
      (process.env.NODE_ENV === 'production' ? "/app" : null) ||
      process.cwd();
    const uploadsBaseDir = join(baseDir, "uploads");
    
    // Создаем директорию для аватаров, если её нет
    // Используем recursive: true для создания всех родительских директорий
    const avatarsDir = join(uploadsBaseDir, "avatars", userId);
    try {
      await mkdir(avatarsDir, { recursive: true });
    } catch (error) {
      console.error("Error creating avatars directory:", error);
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      return NextResponse.json(
        { 
          error: `Ошибка при создании директории для аватара: ${errorMessage}. Размер файла: ${(file.size / (1024 * 1024)).toFixed(2)} MB. Проверьте права доступа к файловой системе.` 
        },
        { status: 500 }
      );
    }

    // Удаляем старый аватар, если есть
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile?.avatar) {
      // Используем ту же логику определения базовой директории
      const oldFilePath = existingProfile.avatar.startsWith('/') 
        ? existingProfile.avatar 
        : join(baseDir, existingProfile.avatar);
      if (existsSync(oldFilePath)) {
        try {
          await unlink(oldFilePath);
        } catch (error) {
          console.error("Error deleting old avatar:", error);
        }
      }
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `avatar-${timestamp}.${extension}`;
    const filePath = join(avatarsDir, fileName);

    // Сохраняем файл
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Сохраняем путь в базе данных (всегда относительный путь)
    const relativePath = `/uploads/avatars/${userId}/${fileName}`;
    
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: { avatar: relativePath },
      create: {
        userId,
        avatar: relativePath,
      },
    });

    return NextResponse.json({
      avatar: relativePath,
      message: "Аватар успешно загружен",
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { 
        error: `Ошибка при загрузке аватара: ${errorMessage}. Проверьте формат файла (поддерживаются: JPG, PNG, GIF, WebP) и размер (максимум 5 MB)` 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Удаляем аватар из базы данных
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (profile?.avatar) {
      // Определяем базовую директорию (та же логика что и при загрузке)
      const baseDir = process.env.UPLOADS_DIR || 
        (process.env.VERCEL === "1" ? "/tmp" : null) ||
        (process.env.NODE_ENV === 'production' ? "/app" : null) ||
        process.cwd();
      // Удаляем файл
      const filePath = profile.avatar.startsWith("/") && !profile.avatar.startsWith("/uploads")
        ? profile.avatar // Абсолютный путь (старые записи)
        : join(baseDir, profile.avatar); // Относительный путь
      
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (error) {
          console.error("Error deleting avatar file:", error);
        }
      }

      // Обновляем профиль
      await prisma.userProfile.update({
        where: { userId },
        data: { avatar: null },
      });
    }

    return NextResponse.json({ message: "Аватар удален" });
  } catch (error) {
    console.error("Avatar delete error:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении аватара" },
      { status: 500 }
    );
  }
}

