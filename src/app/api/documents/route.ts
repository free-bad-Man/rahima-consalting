export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { createNotification } from "@/lib/notifications";
import { NotificationType } from "@prisma/client";

// GET - получение списка документов пользователя
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Формируем условия фильтрации
    const where: any = { userId };
    if (orderId) {
      where.orderId = orderId;
    }
    if (category) {
      where.category = category;
    }

    // Получаем документы
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              serviceName: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      documents,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Documents GET error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении документов" },
      { status: 500 }
    );
  }
}

// POST - загрузка документа
export async function POST(request: Request) {
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

    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const orderId = formData.get("orderId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 }
      );
    }

    // Валидация размера файла (максимум 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Размер файла превышает 50MB" },
        { status: 400 }
      );
    }

    // Проверяем, что orderId принадлежит пользователю (если указан)
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: "Заказ не найден" },
          { status: 404 }
        );
      }
    }

    // Определяем базовую директорию для загрузок
    // UPLOADS_DIR env > /app (Docker) > /tmp (Vercel) > process.cwd() (локально)
    const baseDir = process.env.UPLOADS_DIR || 
      (process.env.VERCEL === "1" ? "/tmp" : null) ||
      (process.env.NODE_ENV === 'production' ? "/app" : null) ||
      process.cwd();
    const uploadsDir = join(baseDir, "uploads", userId);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const originalFileName = file.name;
    const fileExtension = originalFileName.split(".").pop();
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = join(uploadsDir, uniqueFileName);

    // Сохраняем файл
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Сохраняем путь в БД (всегда относительный путь)
    const dbFilePath = `uploads/${userId}/${uniqueFileName}`;

    // Сохраняем информацию о документе в БД
    const document = await prisma.document.create({
      data: {
        userId,
        orderId: orderId || null,
        name: name || originalFileName,
        fileName: originalFileName,
        filePath: dbFilePath,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        category: category || null,
        description: description || null,
      },
      include: {
        order: {
          select: {
            id: true,
            serviceName: true,
            status: true,
          },
        },
      },
    });

    // Создаем уведомление о загрузке документа
    try {
      const documentName = name || originalFileName;
      const orderInfo = orderId && document.order 
        ? ` для заказа "${document.order.serviceName}"`
        : "";
      
      await createNotification({
        userId,
        type: NotificationType.DOCUMENT_READY,
        title: "Документ загружен",
        message: `Документ "${documentName}" успешно загружен${orderInfo}.`,
        link: `/dashboard/documents`,
      });
    } catch (notificationError) {
      // Логируем ошибку, но не прерываем загрузку документа
      console.error("Error creating notification for document upload:", notificationError);
    }

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Documents POST error:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке документа" },
      { status: 500 }
    );
  }
}
