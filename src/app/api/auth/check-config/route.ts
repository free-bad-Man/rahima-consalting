export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";

export async function GET() {
  // Возвращаем только статус конфигурации без раскрытия чувствительной информации
  // Не раскрываем длины секретов и точные URL - это может помочь атакующему
  const config = {
    status: "ok",
    configured: {
      google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      auth: !!process.env.NEXTAUTH_SECRET,
      database: !!(process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL),
    },
  };

  return NextResponse.json(config);
}

