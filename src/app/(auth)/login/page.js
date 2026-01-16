"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  // Kullanıcı giriş bilgilerini tutan state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // YENİ: Hata ve Yüklenme durumlarını yöneten state'ler
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Input değişimlerini yakalar
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Kullanıcı yeniden yazmaya başladığında hatayı temizle (UX İyileştirmesi)
    if (error) setError("");
  };

  /**
   * MOCK (Taklit) GİRİŞ KONTROLÜ
   * Backend API'ye gidip şifreyi doğruluyormuş gibi bekler.
   */
  const checkCredentials = async (email, password) => {
    console.log(`Giriş deneniyor: ${email}`);
    // 1.5 saniye bekle (Ağ gecikmesi simülasyonu)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // DEMO AMAÇLI: Eğer şifre '123456' ise hata ver (Test etmen için)
    // Gerçekte burada backend'den dönen yanıt (200 OK veya 401 Unauthorized) kontrol edilir.
    if (password === "123456") return false; 

    return true; // Diğer durumlarda başarılı say
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Her denemede hatayı sıfırla

    // Basit Validasyon: Şifre çok kısaysa backend'e gitmeden uyar
    if (formData.password.length < 6) {
      setError("HATA: Şifreniz en az 6 karakter olmalıdır.");
      return;
    }

    // Yükleniyor moduna geç
    setIsLoading(true);

    // Giriş Kontrolü (Mock)
    const isValid = await checkCredentials(formData.email, formData.password);

    if (!isValid) {
      setError("HATA: E-posta adresi veya şifre hatalı! Lütfen tekrar deneyin.");
      setIsLoading(false); // Yüklemeyi durdur
      return;
    }

    // Başarılıysa verileri paketle
    const loginPayload = {
      email: formData.email,
      password: formData.password,
    };

    console.log("Giriş Başarılı, Paket:", loginPayload);
    setIsLoading(false);
    
    // TODO: Burada ana sayfaya (dashboard) yönlendirme yapılacak.
    // router.push('/feed');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* --- Header Bölümü --- */}
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
        
        {/* E-posta */}
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

        {/* Şifre */}
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

        {/* --- ORTAK HATA GÖSTERİM ALANI --- */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-semibold text-center animate-pulse dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Submit Butonu */}
        <button
          type="submit"
          disabled={isLoading} 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full mt-2 disabled:cursor-wait"
        >
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
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