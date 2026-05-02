import Navbar from "@/components/Navbar";
import Link from "next/link";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  let currentUser = null;
  if (session?.userId) {
    currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          }
        }
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      
      <Navbar user={currentUser} />

      <div className="flex flex-1 overflow-hidden">
        
        <aside className="w-64 bg-slate-800 dark:bg-zinc-950 text-white flex flex-col p-4 border-r border-slate-700 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-slate-100">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            <Link 
              href="/users" 
              className="p-2 hover:bg-slate-700 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors text-sm font-medium"
            >
              Kullanıcılar
            </Link>
            
            <Link 
              href="/reports" 
              className="p-2 hover:bg-slate-700 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors text-sm font-medium"
            >
              Raporlanan Postlar
            </Link>

            <Link 
              href="/settings" 
              className="p-2 hover:bg-slate-700 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors text-sm font-medium"
            >
              Ayarlar
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}