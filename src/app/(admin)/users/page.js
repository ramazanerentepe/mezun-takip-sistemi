import { PrismaClient } from '@prisma/client';
// Bileşeni src/components altından çağırıyoruz
import UsersTable from '@/components/admin/UsersTable'; 

const prisma = new PrismaClient();

export default async function UsersPage() {
  let users = [];
  let error = null;

  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: { firstName: true, lastName: true }
        }
      }
    });
  } catch (e) {
    console.error("[UsersPage] Veri çekme hatası:", e);
    error = "Kullanıcı verileri yüklenirken bir sorun oluştu.";
  }

  return (
    <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-sm p-6 md:p-8 transition-colors duration-300">
      
      {/* Üst Başlık ve Arama Çubuğu Alanı */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Sistemdeki tüm kayıtlı kullanıcıları görüntüleyin ve yönetin.
          </p>
        </div>
        
        {/* Modern Arama Çubuğu (Navbar'daki stile uygun) */}
        <div className="relative w-full sm:w-auto min-w-[260px] group">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#9d182e] transition-colors duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="İsim veya E-posta ara..." 
            className="w-full bg-gray-100/80 dark:bg-zinc-950/50 hover:bg-gray-200/50 dark:hover:bg-zinc-900 text-sm font-medium tracking-wide placeholder:font-normal rounded-xl py-2.5 pl-10 pr-4 outline-none border border-transparent focus:border-red-500/30 focus:ring-4 focus:ring-red-500/10 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300 text-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Hata veya Tablo Gösterimi */}
      {error ? (
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-white/5 bg-white dark:bg-zinc-900/30">
          <UsersTable initialUsers={users} />
        </div>
      )}

    </div>
  );
}