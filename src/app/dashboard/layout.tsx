import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A1A] to-[#0A0A1A]">
      <div className="flex flex-col md:flex-row">
        {/* Боковая навигация */}
        <aside className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-white/10 bg-[#0A0A0A]/50 backdrop-blur-sm">
          <DashboardNav />
        </aside>

        {/* Основной контент */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

