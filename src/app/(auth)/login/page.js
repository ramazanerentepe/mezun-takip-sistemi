"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth/login-action";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      const result = await loginAction(formData);

      if (result.success) {
        router.push("/feed"); 
      } else {
        setError(result.message);
        setLoading(false); 
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Beklenmedik bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="relative w-20 h-20 mb-2">
          <Image 
            src="/logo.png" 
            alt="Kurum Logosu" 
            fill 
            className="object-contain"
            priority 
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Konya Teknik Üniversitesi <br /> Hoş Geldiniz
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mezun Takip Sistemine giriş yapmak için bilgilerinizi girin.
        </p>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
          {error}
        </div>
      )}

      {/* --- Form --- */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300" htmlFor="email">
            E-posta Adresi
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white"
            id="email"
            name="email"
            placeholder="email@ktun.edu.tr"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300" htmlFor="password">
              Şifre
            </label>
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              Şifremi unuttum?
            </Link>
          </div>
          <input
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white"
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        {/* Button */}
        <button
          type="submit" 
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full mt-2"
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      {/* --- Footer --- */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Hesabınız yok mu?{" "}
        <Link 
          href="/register" 
          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-all"
        >
          Hemen Kayıt Ol
        </Link>
      </div>
    </div>
  );
}