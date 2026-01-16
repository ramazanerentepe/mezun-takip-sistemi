"use client"; // Bu bileşen state (durum) yönetimi içerdiği için Client Component olarak işaretlendi.

import { useState } from "react";
import Image from "next/image";

/**
 * AuthLayout Bileşeni
 * * Giriş (Login) ve Kayıt (Register) sayfalarını kapsayan ana düzen bileşenidir.
 * Kullanıcının yerel saatine göre dinamik olarak arka plan görselini değiştirir.
 * * Performans Notu:
 * `useEffect` yerine `useState` içinde "Lazy Initialization" (Tembel Başlatma) yöntemi
 * kullanılarak, hesaplamanın sadece ilk render sırasında bir kez yapılması sağlanmıştır.
 * Bu sayede gereksiz "re-render" (yeniden çizim) ve görsel titremeleri engellenmiştir.
 */
export default function AuthLayout({ children }) {
  
  // --- STATE YÖNETİMİ ---
  
  // Arka plan görselinin yolunu (path) tutan state.
  // Fonksiyon, bileşen mount edildiğinde (ilk yüklendiğinde) sadece bir kez çalışır.
  const [bgImage] = useState(() => {
    // Tarayıcı tarafında çalıştığımız için kullanıcının sistem saatini alıyoruz.
    const hour = new Date().getHours();

    // Saat aralıklarına göre uygun görseli döndürüyoruz:
    // 06:00 - 11:59 -> Sabah
    // 12:00 - 17:59 -> Öğle
    // 18:00 - 05:59 -> Akşam/Gece
    if (hour >= 6 && hour < 12) {
      return "/sabah.jpeg";
    } else if (hour >= 12 && hour < 18) {
      return "/ogle.jpg";
    } else {
      return "/aksam.jpeg";
    }
  });

  return (
    // Ana Konteyner: Tam ekran (min-h-screen), içerik merkezde, taşmalar gizli.
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden font-sans">
      
      {/* --- ARKA PLAN KATMANI (Background Layer) --- */}
      {/* z-index -10 ile içeriğin arkasında kalması sağlanır */}
      <div className="absolute inset-0 -z-10">
        
        {/* Next.js Image Bileşeni: Otomatik optimizasyon sağlar. */}
        <Image
          src={bgImage}
          alt="KTÜN Kampüs Arka Planı"
          fill // Görselin ebeveyn div'i tamamen kaplamasını sağlar (absolute positioning).
          className="object-cover transition-opacity duration-1000" // Görsel oranını korur ve yumuşak geçiş efekti ekler.
          priority // LCP (Largest Contentful Paint) performansını artırmak için öncelikli yüklenir.
          sizes="100vw" // Tarayıcıya görselin tam ekran genişliğinde olacağını bildirir.
        />
        
        {/* Karartma Katmanı (Overlay): Metinlerin okunabilirliğini artırmak için yarı saydam siyah perde. */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* --- İÇERİK KUTUSU (Content Wrapper) --- */}
      {/* Cam Efekti (Glassmorphism): Yarı saydam beyaz/siyah arka plan ve bulanıklık (blur). */}
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl dark:bg-black/80 dark:border dark:border-zinc-700 transition-all">
        {children} {/* Login veya Register formu buraya render edilir */}
      </div>
      
    </div>
  );
}