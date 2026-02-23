import Navbar from "@/components/Navbar"; 
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function PortalLayout({ children }) {
  // 1. Çerezleri al ve session'ı oku
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  // 2. Token'ı çöz ve payload'ı al
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  let user = null;
  let isAdmin = false;

  // 3. Eğer oturum varsa, kullanıcının gerçek bilgilerini çek
  if (session?.userId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { 
        profile: true // Profile tablosundaki firstName, lastName ve avatarUrl için
      } 
    });

    if (dbUser) {
      user = {
        firstName: dbUser.profile?.firstName || "",
        lastName: dbUser.profile?.lastName || "",
        // Resmi User tablosundan veya Profile tablosundan alıyoruz
        image: dbUser.profileImage || dbUser.profile?.avatarUrl || null,
        role: dbUser.role
      };
      
      isAdmin = dbUser.role === "ADMIN" || dbUser.role === "SUPER_ADMIN";
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      
      {/* user ve isAdmin verilerini Navbar'a gönderiyoruz */}
      <Navbar user={user} isAdmin={isAdmin} />

      {/* İÇERİK ALANI */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-24 md:pb-6 max-w-5xl">
        {children}
      </main>
      
    </div>
  );
}