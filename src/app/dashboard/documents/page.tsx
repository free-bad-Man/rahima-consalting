import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DocumentsList from "@/components/dashboard/documents-list";

export default async function DocumentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/documents");
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Мои документы
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Управление загруженными документами
          </p>
        </div>
      </div>

      {/* Список документов */}
      <DocumentsList />
    </div>
  );
}

