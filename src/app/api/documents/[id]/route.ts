import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// GET - скачивание документа
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { id: documentId } = await params;

    // Получаем документ
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId, // Проверяем, что документ принадлежит пользователю
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Документ не найден" },
        { status: 404 }
      );
    }

    // Читаем файл
    const filePath = join(process.cwd(), document.filePath);
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "Файл не найден на сервере" },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);

    // Возвращаем файл
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(document.fileName)}"`,
        "Content-Length": document.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error("Document GET error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении документа" },
      { status: 500 }
    );
  }
}

// DELETE - удаление документа
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { id: documentId } = await params;

    // Получаем документ
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId, // Проверяем, что документ принадлежит пользователю
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Документ не найден" },
        { status: 404 }
      );
    }

    // Удаляем файл с диска
    const filePath = join(process.cwd(), document.filePath);
    if (existsSync(filePath)) {
      const { unlink } = await import("fs/promises");
      await unlink(filePath);
    }

    // Удаляем запись из БД
    await prisma.document.delete({
      where: {
        id: documentId,
      },
    });

    return NextResponse.json({ message: "Документ успешно удален" });
  } catch (error) {
    console.error("Document DELETE error:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении документа" },
      { status: 500 }
    );
  }
}
