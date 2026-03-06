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
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kullanıcı Yönetimi</h1>
        <input 
          type="text" 
          placeholder="Kullanıcı ara..." 
          className="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error ? (
        <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      ) : (
        <UsersTable initialUsers={users} />
      )}
    </div>
  );
}