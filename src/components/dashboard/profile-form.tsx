"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, Building2, Briefcase, MapPin, Globe, FileText, Save, Loader2, Camera, X } from "lucide-react";
import Image from "next/image";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    emailVerified: Date | null;
  };
  profile: {
    id: string;
    phone: string | null;
    company: string | null;
    position: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    website: string | null;
    bio: string | null;
    avatar: string | null;
  } | null;
}

export default function ProfileForm({ user: initialUser, profile: initialProfile }: ProfileFormProps) {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Определяем текущий аватар (приоритет: загруженный > OAuth image)
  const [avatar, setAvatar] = useState(
    initialProfile?.avatar || initialUser.image || null
  );

  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialProfile?.phone || "",
    company: initialProfile?.company || "",
    position: initialProfile?.position || "",
    address: initialProfile?.address || "",
    city: initialProfile?.city || "",
    country: initialProfile?.country || "",
    website: initialProfile?.website || "",
    bio: initialProfile?.bio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при загрузке аватара");
      }

      setAvatar(data.avatar);
      if (updateSession) {
        await updateSession();
      }

      setMessage({
        type: "success",
        text: "Аватар успешно загружен",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка при загрузке аватара",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Сбрасываем input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить аватар?")) {
      return;
    }

    setIsUploadingAvatar(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при удалении аватара");
      }

      setAvatar(initialUser.image || null);
      if (updateSession) {
        await updateSession();
      }

      setMessage({
        type: "success",
        text: "Аватар удален",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка при удалении аватара",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при сохранении");
      }

      // Обновляем сессию (если доступно)
      if (updateSession) {
        await updateSession();
      }

      setMessage({
        type: "success",
        text: "Профиль успешно обновлен",
      });

      // Скрываем сообщение через 3 секунды
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка при сохранении профиля",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Сообщение об успехе/ошибке */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            Основная информация
          </h2>

          <div className="space-y-4 md:space-y-6">
            {/* Аватар и имя */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
              <div className="flex-shrink-0 relative group">
                {avatar ? (
                  <div className="relative">
                    <Image
                      src={
                        avatar.startsWith("/uploads")
                          ? `/api/profile/avatar/${avatar.replace("/uploads/avatars/", "")}`
                          : avatar
                      }
                      alt={formData.name || "User"}
                      width={80}
                      height={80}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/20 object-cover"
                      unoptimized
                    />
                    {/* Overlay для загрузки/удаления */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={isUploadingAvatar}
                          />
                          {isUploadingAvatar ? (
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4 text-white" />
                          )}
                        </label>
                        {avatar.startsWith("/uploads") && (
                          <button
                            onClick={handleAvatarDelete}
                            disabled={isUploadingAvatar}
                            className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            title="Удалить аватар"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center border-2 border-white/20 hover:border-purple-500/50 transition-colors relative group/avatar">
                      {isUploadingAvatar ? (
                        <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin" />
                      ) : (
                        <>
                          <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                    placeholder="Введите ваше имя"
                  />
                </div>
              </div>
            </div>

            {/* Email (только для чтения) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/50 cursor-not-allowed"
                />
              </div>
              {initialUser.emailVerified && (
                <p className="mt-1 text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Email подтвержден
                </p>
              )}
            </div>

            {/* Телефон */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-2">
                Телефон
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Информация о компании */}
        <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            Информация о компании
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Компания */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-white/70 mb-2">
                Название компании
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                  placeholder="Название вашей компании"
                />
              </div>
            </div>

            {/* Должность */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-white/70 mb-2">
                Должность
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                  placeholder="Ваша должность"
                />
              </div>
            </div>

            {/* Адрес */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-white/70 mb-2">
                Адрес
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                  placeholder="Улица, дом, офис"
                />
              </div>
            </div>

            {/* Город */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white/70 mb-2">
                Город
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                  placeholder="Город"
                />
              </div>
            </div>

            {/* Страна */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-white/70 mb-2">
                Страна
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                  placeholder="Страна"
                />
              </div>
            </div>

            {/* Веб-сайт */}
            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-white/70 mb-2">
                Веб-сайт
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* О себе */}
        <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            О себе
          </h2>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-white/70 mb-2">
              Краткая информация
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors resize-none"
              placeholder="Расскажите о себе или своей компании..."
            />
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Сохранить изменения
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

