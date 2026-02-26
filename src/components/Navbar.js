"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { logoutAction } from "@/actions/auth/logout-action";
import { 
  Home, 
  Search, 
  Users, 
  MessageSquare, 
  Briefcase,
  Moon,
  Sun,
  ChevronDown,
  Bell,
  Shield 
} from "lucide-react";

export default function Navbar({ user, isAdmin }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // KULLANICININ BAŞ HARFLERİNİ HESAPLAMA (Örn: Ramazan Tepe -> RT)
  let userInitials = "U"; // Varsayılan değer (User)
  let fullName = "Kullanıcı";

  if (user?.firstName || user?.lastName) {
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : "";
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : "";
    userInitials = `${firstInitial}${lastInitial}`;
    fullName = `${user.firstName} ${user.lastName}`.trim();
  }

  return (
    <>
      {/* ÜST MENÜ */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-gray-200/50 dark:border-zinc-800/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <Link href="/feed" className="flex items-center gap-3 group">
             <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 drop-shadow-sm">
               <Image src="/logo.png" alt="KTÜN Logo" fill className="object-contain" />
             </div>
             <div className="flex flex-col">
                <span className="text-xl font-extrabold bg-gradient-to-r from-[#9d182e] to-red-600 bg-clip-text text-transparent leading-none tracking-tight">KTÜN</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold tracking-widest mt-0.5">MEZUN TAKİP SİSTEMİ</span>
             </div>
          </Link>

          {/* ORTA: Arama Çubuğu */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#9d182e] transition-colors duration-300">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Mezun, ilan veya şirket ara..." 
                className="w-full bg-gray-100/80 dark:bg-zinc-900/50 text-sm font-medium tracking-wide placeholder:italic placeholder:font-light rounded-full py-2.5 pl-11 pr-4 outline-none border border-gray-200/50 dark:border-zinc-800/50 focus:border-[#9d182e]/50 focus:ring-4 focus:ring-[#9d182e]/10 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300 text-gray-800 dark:text-gray-100 shadow-inner"
              />
            </div>
          </div>

          {/* SAĞ MENÜ */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItem href="/network" icon={<Users size={22} />} label="Ağım" />
            <NavItem href="/messages" icon={<MessageSquare size={22} />} label="Mesajlar" />
            <NavItem href="/jobs" icon={<Briefcase size={22} />} label="İlanlar" />
            
            {isAdmin && (
              <NavItem href="/users" icon={<Shield size={22} />} label="Admin" />
            )}
            
            <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700 mx-2"></div>

            {/* TEMA BUTONU */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-95 overflow-hidden flex items-center justify-center w-10 h-10"
                title="Temayı Değiştir"
              >
                <Sun size={22} className={`absolute text-amber-500 transition-all duration-500 ${resolvedTheme === "dark" ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}`} />
                <Moon size={22} className={`absolute text-slate-600 dark:text-slate-400 transition-all duration-500 ${resolvedTheme === "dark" ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`} />
              </button>
            )}

            {/* DİNAMİK PROFİL ALANI */}
            <div 
              className="relative flex items-center h-16" 
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <Link href="/profile" className="flex items-center gap-1 focus:outline-none group pl-2">
                
                {/* EĞER RESİM VARSA RESMİ GÖSTER, YOKSA BAŞ HARFLERİ */}
                {user?.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#9d182e] shadow-sm group-hover:border-red-600 transition-colors">
                     <Image src={user.image} alt={fullName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-white dark:bg-zinc-800 border-2 border-[#9d182e] text-[#9d182e] rounded-full flex items-center justify-center font-bold shadow-sm group-hover:bg-[#9d182e] group-hover:text-white transition-colors">
                    {userInitials}
                  </div>
                )}
                
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </Link>

              {/* Açılan Menü */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full w-48 pt-2 z-50">
                  <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg shadow-xl py-2">
                    
                    {/* Üstte Kullanıcının Tam Adı */}
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800 mb-1 truncate">
                        {fullName}
                    </div>

                    <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800">Profilim</Link>
                    <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800">Ayarlar</Link>
                    <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>
                    <form action={logoutAction} className="w-full">
                      <button type="submit" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium">
                        Çıkış Yap
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOBİL MENÜ İKONLARI */}
          <div className="flex md:hidden items-center gap-4 text-[#9d182e] dark:text-gray-300">
             {isAdmin && <Link href="/users"><Shield size={24} /></Link>}
             <Link href="/messages"><MessageSquare size={24} /></Link>
             <Bell size={24} />
             
             {/* MOBİL PROFİL & AYARLAR MENÜSÜ */}
             <div className="relative">
                <button 
                  onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)} 
                  className="flex items-center focus:outline-none ml-1"
                >
                  {user?.image ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#9d182e] shadow-sm">
                       <Image src={user.image} alt={fullName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-white dark:bg-zinc-800 border-2 border-[#9d182e] text-[#9d182e] rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                      {userInitials}
                    </div>
                  )}
                </button>

                {/* Mobil Açılan Menü */}
                {isMobileProfileOpen && (
                  <div className="absolute right-0 top-full mt-4 w-48 z-50">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg shadow-xl py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800 mb-1 truncate">
                          {fullName}
                      </div>
                      <Link href="/profile" onClick={() => setIsMobileProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
                        Profilim
                      </Link>
                      <Link href="/settings" onClick={() => setIsMobileProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
                        Ayarlar
                      </Link>
                      <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>
                      <form action={logoutAction} className="w-full">
                        <button type="submit" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium">
                          Çıkış Yap
                        </button>
                      </form>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </nav>

      {/* MOBİL ALT MENÜ */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-zinc-900 border-t-2 border-[#9d182e] dark:border-zinc-800 flex items-center justify-around pb-safe">
        <MobileNavItem href="/feed" icon={<Home size={24} />} label="Akış" />
        <MobileNavItem href="/search" icon={<Search size={24} />} label="Keşfet" />
        <div className="w-14 h-14 bg-[#9d182e] rounded-full flex items-center justify-center text-white -mt-8 shadow-xl border-4 border-white dark:border-zinc-900 cursor-pointer active:scale-95 transition-transform"><span className="text-3xl font-light mb-1">+</span></div>
        <MobileNavItem href="/network" icon={<Users size={24} />} label="Ağ" />
        <div onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400 cursor-pointer active:scale-95 transition-transform">
           <div className="relative w-6 h-6 flex items-center justify-center">
             <Sun size={24} className={`absolute text-amber-500 transition-all duration-500 ${mounted && resolvedTheme === "dark" ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}`} />
             <Moon size={24} className={`absolute text-slate-600 dark:text-slate-400 transition-all duration-500 ${mounted && resolvedTheme !== "dark" ? "rotate-0 opacity-100 scale-100" : "rotate-90 opacity-0 scale-50"}`} />
           </div>
           <span className="text-[10px] mt-1 font-semibold">Tema</span>
        </div>
      </div>
    </>
  );
}

// YARDIMCI BİLEŞENLER
function NavItem({ href, icon, label }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 group">
      <div className="p-1 rounded-lg transition text-gray-400 group-hover:text-[#9d182e] group-hover:bg-red-50 dark:group-hover:bg-zinc-800">
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-wide hidden lg:block text-gray-400 group-hover:text-[#9d182e]">
        {label}
      </span>
    </Link>
  );
}

function MobileNavItem({ href, icon, label }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 hover:text-[#9d182e] dark:hover:text-[#9d182e]">
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </Link>
  );
}