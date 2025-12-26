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
      return NextResponse.json(
        { error: "Файл должен быть изображением" },
        { status: 400 }
      );
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Размер файла не должен превышать 5MB" },
        { status: 400 }
      );
    }

    // Создаем директорию для аватаров, если её нет
    const avatarsDir = join(process.cwd(), "uploads", "avatars", userId);
    if (!existsSync(avatarsDir)) {
      await mkdir(avatarsDir, { recursive: true });
    }

    // Удаляем старый аватар, если есть
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile?.avatar) {
      const oldFilePath = join(process.cwd(), existingProfile.avatar);
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

    // Сохраняем путь в базе данных
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
    return NextResponse.json(
      { error: "Ошибка при загрузке аватара" },
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
      // Удаляем файл
      const filePath = join(process.cwd(), profile.avatar);
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

