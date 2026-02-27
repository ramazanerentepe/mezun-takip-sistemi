"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { logoutAction } from "@/actions/auth/logout-action";
import { searchUsersAction, getNotificationsAction } from "@/actions/navbar/navbar-actions";
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
  Shield,
  Plus,
  Loader2
} from "lucide-react";

export default function Navbar({ user, isAdmin }) {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  
  // Bildirim State'leri
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifLoading, setIsNotifLoading] = useState(true);

  // --- CANLI ARAMA (LIVE SEARCH) STATE'LERİ ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null);

  // 1. LİNTER HATASINI ÇÖZEN KISIM (Hydration için mounted state'ini güvenli şekilde ayarla)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. BİLDİRİMLERİ ASENKRON OLARAK ÇEK
  useEffect(() => {
    let isActive = true;

    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsAction();
        if (isActive) {
          setNotifications(data || []);
          setIsNotifLoading(false);
        }
      } catch (error) {
        if (isActive) setIsNotifLoading(false);
      }
    };

    fetchNotifications();

    return () => {
      isActive = false;
    };
  }, []);

  // 3. ARAMA İÇİN DEBOUNCE (Kullanıcı yazmayı bıraktıktan 300ms sonra tetiklenir)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 4. DEBOUNCED TERM DEĞİŞTİĞİNDE ARAMA YAP
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedTerm.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        // En fazla 5 sonuç getirerek hızlı bir önizleme sunuyoruz
        const results = await searchUsersAction(debouncedTerm, 1, 5);
        setSearchResults(results || []);
      } catch (error) {
        console.error("Canlı arama sırasında hata oluştu:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [debouncedTerm]);

  // Sayfada başka bir yere tıklandığında arama sonuçlarını kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // KULLANICI BAŞ HARFLERİ
  let userInitials = "U";
  let fullName = "Kullanıcı";

  if (user?.firstName || user?.lastName) {
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : "";
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : "";
    userInitials = `${firstInitial}${lastInitial}`;
    fullName = `${user.firstName} ${user.lastName}`.trim();
  }

  // ROLÜ TÜRKÇEYE ÇEVİRME
  const roleMap = {
    SUPER_ADMIN: "Süper Admin",
    ADMIN: "Yönetici",
    ACADEMIC: "Akademisyen",
    GRADUATE: "Öğrenci / Mezun"
  };
  const userRoleText = roleMap[user?.role] || "Kullanıcı";

  // ENTER İLE TÜM SONUÇLARI GÖRME (Eski arama mantığı)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      setShowSearchResults(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      {/* MASAÜSTÜ ÜST MENÜ */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-gray-200/40 dark:border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link href="/feed" className="flex items-center gap-3 group">
             <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
               <Image src="/logo.png" alt="KTÜN Logo" fill className="object-contain drop-shadow-sm" />
             </div>
             <div className="flex flex-col">
                <span className="text-xl font-extrabold bg-gradient-to-r from-[#9d182e] to-rose-600 bg-clip-text text-transparent leading-none tracking-tight">KTÜN</span>
                <span className="text-[9px] text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] mt-0.5 uppercase opacity-80">Mezun Ağı</span>
             </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group" ref={searchContainerRef}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 group-focus-within:text-[#9d182e] transition-colors duration-300">
                <Search size={16} strokeWidth={2} />
              </span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => {
                  if (searchTerm.trim().length > 0) setShowSearchResults(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="İsim, şirket veya ilan ara..." 
                className="w-full bg-gray-100/60 dark:bg-zinc-900/60 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-medium tracking-wide placeholder:font-normal rounded-full py-2 pl-10 pr-4 outline-none border border-transparent focus:border-red-500/20 focus:ring-4 focus:ring-red-500/10 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300 text-gray-800 dark:text-gray-100"
              />

              {/* CANLI ARAMA SONUÇLARI DROPDOWN */}
              {showSearchResults && searchTerm.trim().length >= 2 && (
                <div className="absolute top-[110%] left-0 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearching ? (
                    <div className="flex items-center justify-center p-6 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin text-[#9d182e]" />
                      <span className="ml-2 text-sm font-medium">Aranıyor...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2 flex flex-col max-h-80 overflow-y-auto">
                      <div className="px-4 py-2 text-[10px] font-bold tracking-widest text-gray-400 border-b border-gray-100/50 dark:border-white/5 uppercase">
                        Kişiler ({searchResults.length})
                      </div>
                      {searchResults.map((result) => {
                        const resultName = `${result.firstName} ${result.lastName}`;
                        const resultInitials = `${result.firstName?.charAt(0) || ""}${result.lastName?.charAt(0) || ""}`;
                        const company = result.experiences?.[0]?.company;

                        return (
                          <Link 
                            key={result.id} 
                            href={`/profile/${result.id}`}
                            onClick={() => setShowSearchResults(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            {result.user?.profileImage ? (
                              <Image src={result.user.profileImage} alt={resultName} width={36} height={36} className="rounded-full object-cover w-9 h-9 border border-gray-200 dark:border-zinc-700" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold border border-gray-200 dark:border-zinc-700">
                                {resultInitials}
                              </div>
                            )}
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{resultName}</span>
                              {company && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{company}</span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                      
                      <Link 
                        href={`/search?q=${encodeURIComponent(searchTerm)}`}
                        onClick={() => setShowSearchResults(false)}
                        className="p-3 text-center text-sm font-semibold text-[#9d182e] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-gray-100 dark:border-white/5 mt-1"
                      >
                        Tüm "{searchTerm}" sonuçlarını gör
                      </Link>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-gray-500 font-medium">Sonuç bulunamadı</p>
                      <p className="text-xs text-gray-400 mt-1">Farklı kelimelerle aramayı deneyin.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <NavItem href="/network" icon={<Users size={20} strokeWidth={1.75} />} label="Ağım" />
            <NavItem href="/jobs" icon={<Briefcase size={20} strokeWidth={1.75} />} label="İlanlar" />
            <NavItem href="/messages" icon={<MessageSquare size={20} strokeWidth={1.75} />} label="Mesajlar" />
            
            {isAdmin && (
              <NavItem href="/users" icon={<Shield size={20} strokeWidth={1.75} />} label="Admin" />
            )}
            
            <div className="h-8 w-px bg-gray-200 dark:bg-zinc-800 mx-3"></div>

            {/* BİLDİRİMLER AÇILIR MENÜSÜ */}
            <div 
              className="relative flex items-center h-16 px-2"
              onMouseEnter={() => setIsNotificationsOpen(true)}
              onMouseLeave={() => setIsNotificationsOpen(false)}
            >
              <button className="relative p-2 rounded-xl text-gray-500 hover:text-[#9d182e] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300">
                <Bell size={20} strokeWidth={1.75} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-950 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-[3.5rem] w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                    <div className="px-4 py-3 text-[11px] font-bold tracking-widest text-gray-400 border-b border-gray-100/50 dark:border-white/5 uppercase">
                      Bildirimler
                    </div>
                    
                    <div className="max-h-72 overflow-y-auto">
                      {isNotifLoading ? (
                        <div className="px-4 py-8 text-center text-xs text-gray-500">Bildirimler yükleniyor...</div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-gray-500">Yeni bildiriminiz bulunmuyor.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 border-b border-gray-100/50 dark:border-white/5 cursor-pointer transition-colors flex items-start gap-3">
                            {notif.actorImage ? (
                              <Image src={notif.actorImage} alt={notif.actorName} width={32} height={32} className="rounded-full object-cover w-8 h-8 flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 flex-shrink-0 rounded-full bg-red-50 dark:bg-zinc-800 text-[#9d182e] flex items-center justify-center text-xs font-bold border border-red-100 dark:border-zinc-700">
                                {notif.actorName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-700 dark:text-gray-200 leading-tight">
                                <span className="font-semibold text-gray-900 dark:text-white">{notif.actorName}</span> {notif.message}
                              </p>
                              <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                                {new Date(notif.time).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <Link href="/notifications" onClick={() => setIsNotificationsOpen(false)} className="block text-center px-4 py-3 text-xs text-gray-500 hover:text-[#9d182e] font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      Tümünü Gör
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="relative flex items-center justify-center w-9 h-9 mx-1 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-500 transition-all duration-300 active:scale-95 overflow-hidden border border-gray-200/50 dark:border-zinc-800/50 shadow-sm"
                title="Temayı Değiştir"
              >
                <div className={`absolute inset-0 transition-transform duration-500 ease-out ${resolvedTheme === "dark" ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}`}>
                  <Moon size={16} strokeWidth={2} className="absolute inset-0 m-auto text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]" />
                </div>
                <div className={`absolute inset-0 transition-transform duration-500 ease-out ${resolvedTheme === "dark" ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`}>
                  <Sun size={16} strokeWidth={2} className="absolute inset-0 m-auto text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                </div>
              </button>
            )}

            {/* MASAÜSTÜ PROFİL BÖLÜMÜ */}
            <div 
              className="relative flex items-center h-16 pl-2" 
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <Link href="/profile" className="flex items-center gap-1.5 focus:outline-none group">
                {user?.image ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-red-500/50">
                     <Image src={user.image} alt={fullName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-red-50 to-red-100 dark:from-zinc-800 dark:to-zinc-900 border border-red-100 dark:border-zinc-700 text-[#9d182e] rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 group-hover:shadow-md">
                    {userInitials}
                  </div>
                )}
                <ChevronDown size={14} strokeWidth={2} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </Link>

              {isProfileOpen && (
                <div className="absolute right-0 top-[3.5rem] w-52 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2">
                    <div className="px-4 py-2 border-b border-gray-100/50 dark:border-white/5 mb-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{fullName}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{userRoleText}</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Profili Görüntüle</Link>
                    <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Ayarlar</Link>
                    <div className="border-t border-gray-100/50 dark:border-white/5 my-1"></div>
                    <form action={logoutAction} className="w-full">
                      <button type="submit" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors cursor-pointer">
                        Çıkış Yap
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-3">
             <Link href="/search" className="p-2 text-gray-500 hover:text-[#9d182e]"><Search size={22} strokeWidth={1.5} /></Link>
             <Link href="/messages" className="p-2 text-gray-500 hover:text-[#9d182e]"><MessageSquare size={22} strokeWidth={1.5} /></Link>
             <Link href="/notifications" className="relative p-2 text-gray-500 hover:text-[#9d182e]">
               <Bell size={22} strokeWidth={1.5} />
               {notifications.length > 0 && (
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
               )}
             </Link>
          </div>
        </div>
      </nav>

      {/* MOBİL ALT MENÜ */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full pb-safe">
        <div className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/5 flex items-center justify-around px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
          <MobileNavItem href="/feed" icon={<Home size={22} strokeWidth={1.5} />} label="Akış" />
          <MobileNavItem href="/network" icon={<Users size={22} strokeWidth={1.5} />} label="Ağım" />
          
          <div className="relative -top-5 flex flex-col items-center">
             <div className="w-14 h-14 bg-gradient-to-tr from-[#9d182e] to-rose-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_16px_rgba(157,24,46,0.3)] dark:shadow-[0_8px_16px_rgba(157,24,46,0.5)] border-4 border-white dark:border-zinc-950 cursor-pointer active:scale-90 transition-transform duration-300">
               <Plus size={28} strokeWidth={2} />
             </div>
          </div>
          
          <MobileNavItem href="/jobs" icon={<Briefcase size={22} strokeWidth={1.5} />} label="İlanlar" />
          
          <div className="relative h-full flex items-center justify-center min-w-[64px]">
             <button 
               onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)} 
               className="flex flex-col items-center justify-center focus:outline-none w-full h-full active:scale-95 transition-transform"
             >
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm mb-1">
                  {user?.image ? (
                    <Image src={user.image} alt={fullName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 dark:from-zinc-800 dark:to-zinc-900 text-[#9d182e] flex items-center justify-center font-bold text-[10px]">
                      {userInitials}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Profil</span>
             </button>

             {isMobileProfileOpen && (
               <div className="absolute bottom-full right-2 mb-4 w-48 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                 <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-gray-200/50 dark:border-white/5 rounded-2xl shadow-2xl py-2 overflow-hidden">
                   <div className="px-4 py-2 border-b border-gray-100/50 dark:border-white/5 mb-1">
                       <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{fullName}</p>
                       <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{userRoleText}</p>
                   </div>
                   
                   {isAdmin && (
                     <Link href="/users" onClick={() => setIsMobileProfileOpen(false)} className="block px-4 py-2 text-sm font-bold text-[#9d182e] hover:bg-black/5 dark:hover:bg-white/5">
                       Admin Paneli
                     </Link>
                   )}

                   <Link href="/profile" onClick={() => setIsMobileProfileOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5">Profilim</Link>
                   
                   <button 
                     onClick={() => { setTheme(resolvedTheme === "dark" ? "light" : "dark"); setIsMobileProfileOpen(false); }} 
                     className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                   >
                     <span>Tema Görünümü</span>
                     {mounted && ( resolvedTheme === "dark" ? <Moon size={16} className="text-indigo-400" /> : <Sun size={16} className="text-amber-500" /> )}
                   </button>

                   <Link href="/settings" onClick={() => setIsMobileProfileOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5">Ayarlar</Link>
                   <div className="border-t border-gray-100/50 dark:border-white/5 my-1"></div>
                   <form action={logoutAction} className="w-full">
                     <button type="submit" className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                       Çıkış Yap
                     </button>
                   </form>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
}

// YARDIMCI BİLEŞENLER
function NavItem({ href, icon, label }) {
  return (
    <Link href={href} className="relative flex flex-col items-center justify-center w-16 h-14 group">
      <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#9d182e] dark:group-hover:text-red-400 transition-colors duration-300 z-10 mb-0.5">
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide text-gray-400 dark:text-gray-500 group-hover:text-[#9d182e] dark:group-hover:text-red-400 transition-colors duration-300 z-10">
        {label}
      </span>
      <div className="absolute inset-0 m-auto w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-0"></div>
    </Link>
  );
}

function MobileNavItem({ href, icon, label }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-16 h-full text-gray-400 dark:text-gray-500 hover:text-[#9d182e] dark:hover:text-red-400 active:scale-90 transition-all duration-200 group">
      <div className="transition-transform duration-200 group-active:-translate-y-1 mb-1">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}