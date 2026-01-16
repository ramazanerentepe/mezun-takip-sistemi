"use client"; // Saati kontrol etmek için Client Component yapıyoruz

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AuthLayout({ children }) {
  // Varsayılan olarak öğle resmini koyuyoruz (yüklenene kadar)
  const [bgImage, setBgImage] = useState("/ogle.jpg");

  useEffect(() => {
    // Kullanıcının saatini al
    const hour = new Date().getHours();
    //test kodu const hour = 19;

    // Mantık: Sabah (06-12), Öğle (12-18), Akşam/Gece (18-06)
    if (hour >= 6 && hour < 12) {
      setBgImage("/sabah.jpeg");
    } else if (hour >= 12 && hour < 18) {
      setBgImage("/ogle.jpg");
    } else {
      setBgImage("/aksam.jpeg");
    }
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden font-sans">
      
      {/* --- ARKA PLAN KATMANI --- */}
      <div className="absolute inset-0 -z-10">
        {/* Okul Resmi */}
        <Image
          src={bgImage}
          alt="KTÜN Kampüs"
          fill
          className="object-cover transition-opacity duration-1000" // Yumuşak geçiş
          priority
        />
        {/* Okunabilirlik için Siyah Perde (Overlay) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* --- FORM KUTUSU --- */}
      {/* bg-white/90 ve backdrop-blur ile cam efekti veriyoruz */}
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl dark:bg-black/80 dark:border dark:border-zinc-700 transition-all">
        {children}
      </div>
      
    </div>
  );
}