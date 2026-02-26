import { searchUsersAction } from "@/actions/navbar/navbar-actions";
import Image from "next/image";
import Link from "next/link";
import { Search, Briefcase, GraduationCap, UserPlus, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Arama Sonuçları | KTÜN Mezun Takip",
};

export default async function SearchPage({ searchParams }) {
  // Next.js 15'te searchParams asenkron olarak çözülür
  const params = await searchParams;
  const query = params?.q || "";

  // Backend'den arama sonuçlarını çekiyoruz (İlk sayfa, 20 limit)
  const results = await searchUsersAction(query, 1, 20);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* BAŞLIK VE ÖZET */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Search className="text-[#9d182e]" size={28} strokeWidth={2} />
          Arama Sonuçları
        </h1>
        {query ? (
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            <span className="font-semibold text-gray-900 dark:text-gray-200">&quot;{query}&quot;</span> için {results.length} sonuç bulundu.
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Arama yapmak için yukarıdaki çubuğu kullanabilirsiniz.
          </p>
        )}
      </div>

      {/* SONUÇLAR LİSTESİ */}
      {query === "" ? (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-12 text-center shadow-sm">
          <Search size={48} strokeWidth={1.5} className="mx-auto text-gray-300 dark:text-zinc-700 mb-4" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Kimi arıyorsunuz?</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            İsim, soyisim, çalıştığı şirket veya mezuniyet yılına göre arama yapabilirsiniz.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-12 text-center shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sonuç Bulunamadı</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            &quot;{query}&quot; ile eşleşen bir KTÜN mezunu veya öğrencisi bulamadık. Farklı anahtar kelimeler denemeyi unutmayın.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {results.map((profile) => {
            const fullName = `${profile.firstName} ${profile.lastName}`;
            const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
            const latestExperience = profile.experiences?.[0]; // En güncel deneyim
            
            return (
              <div 
                key={profile.id} 
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(157,24,46,0.08)] dark:hover:shadow-[0_8px_30px_rgba(157,24,46,0.15)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group"
              >
                {/* SOL: Profil Fotoğrafı */}
                <Link href={`/profile/${profile.userId}`} className="flex-shrink-0 relative">
                  {profile.user?.profileImage ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-zinc-800 group-hover:border-[#9d182e]/50 transition-colors">
                      <Image src={profile.user.profileImage} alt={fullName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-50 to-red-100 dark:from-zinc-800 dark:to-zinc-900 border-2 border-red-100 dark:border-zinc-700 text-[#9d182e] rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm group-hover:border-[#9d182e]/50 transition-colors">
                      {initials}
                    </div>
                  )}
                </Link>

                {/* ORTA: Profil Bilgileri */}
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${profile.userId}`} className="inline-block">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-[#9d182e] transition-colors">
                      {fullName}
                    </h2>
                  </Link>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate mt-0.5">
                    {profile.academicTitle || 'KTÜN Mensubu'}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs text-gray-500 dark:text-gray-400">
                    {/* Deneyim Varsa Göster */}
                    {latestExperience && (
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md max-w-full">
                        <Briefcase size={14} className="text-[#9d182e]" />
                        <span className="truncate">{latestExperience.title} @ {latestExperience.company}</span>
                      </div>
                    )}
                    
                    {/* Mezuniyet Yılı Varsa Göster */}
                    {profile.graduationYear && (
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md">
                        <GraduationCap size={14} className="text-[#9d182e]" />
                        <span>Mezuniyet: {profile.graduationYear}</span>
                      </div>
                    )}
                    
                    {/* Takipçi Sayısı */}
                    <div className="flex items-center gap-1 font-medium text-gray-400">
                       <span>{profile.user?._count?.followedBy || 0}</span>
                       <span>takipçi</span>
                    </div>
                  </div>
                </div>

                {/* SAĞ: Aksiyon Butonları */}
                <div className="w-full sm:w-auto flex sm:flex-col gap-2 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#9d182e] hover:bg-rose-700 text-white text-sm font-medium py-2 px-5 rounded-xl transition-all active:scale-95 shadow-[0_4px_10px_rgba(157,24,46,0.3)]">
                    <UserPlus size={16} strokeWidth={2} />
                    <span>Bağlan</span>
                  </button>
                  <Link href={`/profile/${profile.userId}`} className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 px-5 rounded-xl transition-all active:scale-95">
                    <span>Profili Gör</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}