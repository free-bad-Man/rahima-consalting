import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/profile");
  }

  const userId = (session.user as any).id;

  // Получаем данные пользователя и профиля
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    redirect("/auth/signin?callbackUrl=/dashboard/profile");
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
          Мой профиль
        </h1>
        <p className="text-white/60 text-sm md:text-base">
          Управление личными данными и информацией о компании
        </p>
      </div>

      {/* Форма профиля */}
      <ProfileForm 
        user={{
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          image: user.image || null,
          emailVerified: user.emailVerified,
        }}
        profile={user.profile || null}
      />
    </div>
  );
}
