"use client"; // Client component olduğunu belirtiyoruz

import { useState } from "react";
import Image from "next/image"; // Logoyu göstermek için
import Link from "next/link";   

export default function VerifyPage() {
  // 1. STATE: Kullanıcının girdiği kodu burada tutuyoruz.
  const [code, setCode] = useState("");

  // 2. LOGIC: Butona basılınca çalışacak fonksiyon
  const handleVerify = (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle

    // Veriyi paketliyoruz
    const packagedData = {
      verificationCode: code
    };

    // Şimdilik sadece konsola yazdırıyoruz (Sorgu yok!)
    console.log("PAKETLENEN VERİ:", packagedData);
    alert(`Kod Paketlendi: ${code}`); // Ekranda da görelim
  };

  return (
    // Dış Kapsayıcı: Login sayfasıyla aynı boşluk (gap-6) yapısı
    <div className="flex flex-col gap-6">
      
      {/* --- HEADER KISMI --- */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="relative w-20 h-20 mb-2">
          {/* Logo Login sayfasıyla aynı */}
          <Image 
            src="/logo.png" 
            alt="Kurum Logosu" 
            fill 
            className="object-contain"
            priority 
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Hesabınızı Doğrulayın
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Lütfen e-posta adresinize gönderilen 6 haneli kodu giriniz.
        </p>
      </div>

      {/* --- FORM KISMI --- */}
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-gray-300" htmlFor="code">
            Doğrulama Kodu
          </label>
          
          {/* ÖZEL INPUT TASARIMI:
             text-center: Yazı ortada başlar.
             text-2xl: Yazı fontu büyüktür (okunabilirlik).
             tracking-[0.5em]: Harfler arası boşluk (kod gibi durması için).
             uppercase: Otomatik büyük harf gösterir.
          */}
          <input
            id="code"
            name="code"
            type="text"
            maxLength={6} // En fazla 6 karakter
            placeholder="XXXXXX"
            className="
              flex h-14 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 
              text-center text-2xl font-bold tracking-[0.5em] uppercase
              placeholder:text-gray-300 placeholder:tracking-normal
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent 
              dark:border-zinc-700 dark:text-white
              transition-all duration-200
            "
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())} // Yazarken BÜYÜK harfe çevir
            required
            autoComplete="off"
          />
        </div>

        {/* Buton - Login sayfasıyla aynı stil */}
        <button
          type="submit"
          className="
            inline-flex items-center justify-center rounded-md text-sm font-medium 
            bg-blue-600 text-white hover:bg-blue-700 
            h-10 px-4 py-2 w-full mt-2 transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          "
        >
          Doğrula
        </button>
      </form>

      {/* --- FOOTER KISMI --- */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Kod gelmedi mi?{" "}
        <button 
          type="button"
          onClick={() => alert("Kod tekrar gönderildi (Simülasyon)")}
          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-all"
        >
          Tekrar Gönder
        </button>
        <div className="mt-4">
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                &larr; Giriş ekranına dön
            </Link>
        </div>
      </div>
    </div>
  );
}