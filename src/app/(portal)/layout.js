"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { 
  Home, 
  Search, 
  Users, 
  Briefcase, 
  Bell, 
  Menu,
  Moon,
  Sun
} from "lucide-react";

export default function PortalLayout({ children }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // Ana arka planı gri-50'den tamamen beyaza çektik veya çok hafif gri bıraktık ki kartlar belli olsun.
    // Ancak "Kırmızı-Beyaz" isteğin için arka planı 'bg-white' yapıp, içerik alanlarını ayırabiliriz.
    // Göz yormaması için çok çok açık gri (gray-50) idealdir ama beyaz hissi verir.
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      
      {/* NAVBAR: KTÜN Kırmızı Çizgili Üst Menü 
          Border-b-red-600 ekledik ki kurumsallık vurgulansın.
      */}
      <nav className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b-2 border-[#9d182e] dark:border-zinc-800 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO ALANI */}
          <Link href="/feed" className="flex items-center gap-2 group">
             <div className="w-9 h-9 bg-[#9d182e] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
               K
             </div>
             <div className="flex flex-col">
                <span className="text-xl font-bold text-[#9d182e] dark:text-red-500 leading-none tracking-tight">KTÜN</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">MEZUN SİSTEMİ</span>
             </div>
          </Link>

          {/* ORTA: Arama Çubuğu */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#9d182e] opacity-50">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Mezun veya iş ilanı ara..." 
                className="w-full bg-red-50 dark:bg-zinc-800 text-sm rounded-full py-2.5 pl-10 pr-4 outline-none border border-transparent focus:border-[#9d182e] focus:bg-white transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
            </div>
          </div>

          {/* SAĞ MENÜ */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItem href="/feed" icon={<Home size={22} />} label="Akış" active />
            <NavItem href="/network" icon={<Users size={22} />} label="Ağım" />
            <NavItem href="/jobs" icon={<Briefcase size={22} />} label="İlanlar" />
            
            <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700 mx-2"></div>

            {/* DARK MODE SWITCH */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200 dark:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9d182e] focus:ring-offset-1"
              >
                <span className="sr-only">Tema Değiştir</span>
                <span
                  className={`${
                    resolvedTheme === "dark" ? "translate-x-6" : "translate-x-1"
                  } inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out flex items-center justify-center`}
                >
                  {resolvedTheme === "dark" ? (
                    <Moon size={12} className="text-[#9d182e]" />
                  ) : (
                    <Sun size={12} className="text-orange-500" />
                  )}
                </span>
              </button>
            )}

            {/* PROFİL */}
            <div className="w-10 h-10 bg-white border-2 border-[#9d182e] text-[#9d182e] rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-[#9d182e] hover:text-white transition shadow-sm">
              R
            </div>
          </div>

          {/* MOBİL MENÜ İKONLARI */}
          <div className="flex md:hidden items-center gap-4 text-[#9d182e] dark:text-gray-300">
             <Bell size={24} />
             <Menu size={24} />
          </div>
        </div>
      </nav>

      {/* İÇERİK ALANI */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-24 md:pb-6 max-w-5xl">
        {children}
      </main>

      {/* MOBİL ALT MENÜ */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-zinc-900 border-t-2 border-[#9d182e] dark:border-zinc-800 flex items-center justify-around pb-safe">
        <MobileNavItem href="/feed" icon={<Home size={24} />} label="Ana Sayfa" active />
        <MobileNavItem href="/search" icon={<Search size={24} />} label="Keşfet" />
        
        {/* Ekle Butonu */}
        <div className="w-14 h-14 bg-[#9d182e] rounded-full flex items-center justify-center text-white -mt-8 shadow-xl border-4 border-white dark:border-zinc-900 cursor-pointer active:scale-95 transition-transform">
          <span className="text-3xl font-light mb-1">+</span>
        </div>
        
        <MobileNavItem href="/network" icon={<Users size={24} />} label="Ağ" />
        
        {/* Mobilde Tema Değiştirme */}
        <div 
           onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
           className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 cursor-pointer hover:text-[#9d182e]"
        >
           {mounted && resolvedTheme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
           <span className="text-[10px] mt-1 font-medium">Tema</span>
        </div>
      </div>
    </div>
  );
}

// YARDIMCI BİLEŞENLER
function NavItem({ href, icon, label, active }) {
  // Aktif değilse gri yerine daha koyu gri veya kırmızımsı gri kullanarak "siyah" hissini azalttık.
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 group`}>
      <div className={`p-1 rounded-lg transition ${active ? 'text-[#9d182e]' : 'text-gray-400 group-hover:text-[#9d182e] group-hover:bg-red-50'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-wide hidden lg:block ${active ? 'text-[#9d182e]' : 'text-gray-400 group-hover:text-[#9d182e]'}`}>
        {label}
      </span>
    </Link>
  );
}

function MobileNavItem({ href, icon, label, active }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-full h-full ${active ? 'text-[#9d182e]' : 'text-gray-400 dark:text-gray-500'}`}>
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </Link>
  );
}