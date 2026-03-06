import Navbar from "@/components/Navbar"; 
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { PrismaClient } from "@prisma/client";

// Not: Projen büyüdüğünde Prisma'yı global bir dosyadan import etmen daha iyi olur.
const prisma = new PrismaClient();

export default async function PortalLayout({ children }) {
  // 1. Çerezleri al ve session'ı oku
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  // 2. Token'ı çöz ve payload'ı al
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  let currentUser = null;
  let isAdmin = false;

  // 3. Eğer oturum varsa, kullanıcının gerçek bilgilerini çek
  if (session?.userId) {
    // include yerine select kullanmak performansı artırır, sadece gereken veriyi çeker
    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        role: true,
        profileImage: true, // Ana tablodaki resim
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true, // Profil tablosundaki resim
          }
        }
      }
    });

    if (dbUser) {
      // Navbar bileşeni verileri "user.profile.firstName" şeklinde beklediği için
      // objeyi Navbar'ın okuyabileceği formata sokuyoruz.
      currentUser = {
        id: dbUser.id,
        role: dbUser.role,
        profile: {
          firstName: dbUser.profile?.firstName || "",
          lastName: dbUser.profile?.lastName || "",
          // Eğer User modelinde profileImage varsa onu, yoksa Profile modelindeki avatarUrl'i kullan
          avatarUrl: dbUser.profileImage || dbUser.profile?.avatarUrl || null
        }
      };
      
      isAdmin = dbUser.role === "ADMIN" || dbUser.role === "SUPER_ADMIN";
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      
      {/* user ve isAdmin verilerini Navbar'a gönderiyoruz */}
      <Navbar user={currentUser} isAdmin={isAdmin} />

      {/* İÇERİK ALANI */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-24 md:pb-6 max-w-5xl">
        {children}
      </main>
      
    </div>
  );
}