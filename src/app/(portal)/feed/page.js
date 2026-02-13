import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { logoutAction } from "@/actions/auth/logout-action"; // <-- YENİ: Action'ı import ettik

const prisma = new PrismaClient();

export default async function FeedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = await decrypt(token);

  let user = null;
  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true }
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      
      {/* Üst Bar: Başlık ve Çıkış Butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Hoş Geldin, {user?.profile?.firstName}! 👋
        </h1>

        {/* --- ÇIKIŞ BUTONU --- */}
        <form action={logoutAction}>
          <button 
            type="submit" 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
      
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Burası sadece giriş yapmış ve yetkilendirilmiş kullanıcıların görebileceği özel alandır.
      </p>

      {/* Kullanıcı Bilgi Kartı */}
      <div className="mt-8 p-6 border rounded-xl bg-white dark:bg-zinc-900 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Kimlik Bilgilerin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="block text-sm text-gray-500">E-posta Adresi</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Kullanıcı Rolü</span>
            <span className="font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm inline-block">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}