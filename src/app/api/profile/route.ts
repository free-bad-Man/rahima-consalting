import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - получение профиля пользователя
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Получаем пользователя с профилем
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      profile: user.profile,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении профиля" },
      { status: 500 }
    );
  }
}

// PUT - обновление профиля пользователя
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const { name, phone, company, position, address, city, country, website, bio } = body;

    // Обновляем основные данные пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
      },
    });

    // Обновляем или создаем профиль
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(position !== undefined && { position }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(website !== undefined && { website }),
        ...(bio !== undefined && { bio }),
      },
      create: {
        userId,
        ...(phone && { phone }),
        ...(company && { company }),
        ...(position && { position }),
        ...(address && { address }),
        ...(city && { city }),
        ...(country && { country }),
        ...(website && { website }),
        ...(bio && { bio }),
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении профиля" },
      { status: 500 }
    );
  }
}
