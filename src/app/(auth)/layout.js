"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AuthLayout({ children }) {
  const [bgImage, setBgImage] = useState("/ogle.jpg");

  // Saate göre resim değiştirme mantığın aynen kalıyor
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setBgImage("/sabah.jpeg");
    } else if (hour >= 12 && hour < 18) {
      setBgImage("/ogle.jpg");
    } else {
      setBgImage("/aksam.jpeg");
    }
  }, []);

  return (
    // min-h-screen: Sayfa boyu kadar yer kapla
    // overflow-x-hidden: Yanlara taşmayı engelle
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
      
      {/* 1. PROBLEMİN ÇÖZÜMÜ: 'fixed'
         Arka planı sayfaya "çiviledik". Artık içerik kaysa bile resim sabit kalacak.
      */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={bgImage}
          alt="KTÜN Kampüs"
          fill
          className="object-cover transition-opacity duration-1000"
          priority
        />
        {/* Siyah perde (Overlay) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* İçerik Alanı (Scroll edilebilir kısım) */}
      <div className="flex min-h-screen items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl dark:bg-black/80 dark:border dark:border-zinc-700 transition-all">
          {children}
        </div>
      </div>
      
    </div>
  );
}