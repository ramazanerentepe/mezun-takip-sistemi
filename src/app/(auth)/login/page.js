"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  // Kullanıcı giriş bilgilerini tutan state tanımı
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /**
   * Input alanlarındaki değişiklikleri dinler ve state'i günceller.
   * Dinamik olarak 'id' özelliğini anahtar, 'value' özelliğini değer olarak kullanır.
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /**
   * Form gönderildiğinde (submit) çalışacak fonksiyon.
   * Verileri SQL Enjeksiyonuna karşı korumalı bir JSON objesi olarak paketler.
   */
  const handleLogin = (e) => {
    e.preventDefault(); // Sayfanın varsayılan yenilenme davranışını engeller

    // Veri Paketleme (Payload Creation)
    const loginPayload = {
      email: formData.email,
      password: formData.password,
    };

    // Geliştirme aşamasında payload kontrolü
    console.log("Login Payload:", loginPayload);

    // TODO: Backend API servisine (ör. /api/auth/login) istek burada atılacak.
  };

  return (
    <div className="flex flex-col gap-6">
      {/* --- Header Bölümü: Logo ve Karşılama Mesajı --- */}
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

      {/* --- Login Formu --- */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        {/* E-posta Input Grubu */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300" htmlFor="email">
            E-posta Adresi
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white"
            id="email"
            placeholder="ornek@ktun.edu.tr"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Şifre Input Grubu */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300" htmlFor="password">
              Şifre
            </label>
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Şifremi unuttum?
            </Link>
          </div>
          <input
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white"
            id="password"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Butonu */}
        <button
          type="submit" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full mt-2"
        >
          Giriş Yap
        </button>
      </form>

      {/* --- Footer Linkleri --- */}
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