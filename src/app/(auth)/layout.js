"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AuthLayout({ children }) {
  // 1. Başlangıç durumu: Varsayılan bir resim belirle.
  // Sayfa ilk açıldığında sunucu ve istemci bu resmi görecek.
  // Hız için bu şart.
  const [bgImage, setBgImage] = useState("/ogle.jpg");

  useEffect(() => {
    // Bu kısım sadece tarayıcıda çalışır.
    const hour = new Date().getHours();
    let targetImage = "/ogle.jpg"; // Varsayılan hedefimiz

    // Hangi resim olması gerektiğini hesapla
    if (hour >= 6 && hour < 12) {
      targetImage = "/sabah.jpeg";
    } else if (hour >= 18 || hour < 6) {
      // 18'den büyük VEYA 6'dan küçükse (Akşam/Gece)
      targetImage = "/aksam.jpeg";
    }
    // Not: 12-18 arası zaten targetImage '/ogle.jpg' olarak kaldı.

    // 2. KRİTİK NOKTA (Hız ve Linter Hatası Çözümü):
    // React'e sadece "Resim gerçekten değişecekse güncelle" diyoruz.
    // Eğer saat öğlen 14:00 ise, bgImage zaten '/ogle.jpg', targetImage da '/ogle.jpg'.
    // Bu if bloğu çalışmayacak, setState çağrılmayacak ve gereksiz render olmayacak.
    if (targetImage !== bgImage) {
        setBgImage(targetImage);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sadece component ilk yüklendiğinde 1 kere çalışır.

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
      
      {/* 3. Opacity geçişlerini kaldırdık, sabit div'e gerek kalmadı */}
      <div className="fixed inset-0 -z-10 bg-gray-900">
             <Image
              src={bgImage}
              alt="Arka Plan"
              fill
              // object-cover: Resmi ekrana yayar
              className="object-cover"
              // priority: Next.js'e bu resmin çok önemli olduğunu ve hemen yüklemesini söyler.
              priority
              sizes="100vw"
            />
        
        {/* Siyah perde (Overlay) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="flex min-h-screen items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl dark:bg-black/80 dark:border dark:border-zinc-700 transition-all">
          {children}
        </div>
      </div>
      
    </div>
  );
}