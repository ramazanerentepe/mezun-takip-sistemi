import { PrismaClient } from '@prisma/client';
import UsersTable from '@/components/admin/UsersTable'; 
import SearchInput from '@/components/admin/SearchInput'; 
import PendingFilterButton from '@/components/admin/PendingFilterButton';

const prisma = new PrismaClient();

export default async function UsersPage(props) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const pendingOnly = searchParams?.pendingOnly === "true";

  let users = [];
  let pendingCount = 0;
  let error = null;

  try {
    pendingCount = await prisma.user.count({
      where: { isAdminApproved: false }
    });

    const whereClause = {
      ...(pendingOnly ? { isAdminApproved: false } : {}),
      ...(query ? {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { profile: { firstName: { contains: query, mode: 'insensitive' } } },
          { profile: { lastName: { contains: query, mode: 'insensitive' } } },
        ]
      } : {})
    };

    users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: { firstName: true, lastName: true }
        }
      }
    });
  } catch (e) {
    console.error(e);
    error = "Kullanıcı verileri yüklenirken bir sorun oluştu.";
  }

  return (
    <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-sm p-6 md:p-8 transition-colors duration-300">
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Sistemdeki tüm kayıtlı kullanıcıları görüntüleyin ve yönetin.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
          <PendingFilterButton pendingCount={pendingCount} />
          <SearchInput defaultValue={query} />
        </div>
      </div>

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