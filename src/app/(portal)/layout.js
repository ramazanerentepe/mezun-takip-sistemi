import Navbar from "@/components/Navbar"; 
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function PortalLayout({ children }) {
  // 1. Çerezleri al ve session'ı oku
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  // 2. Token'ı çöz ve payload'ı al
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  // 3. Kullanıcı admin veya super admin mi kontrol et
  const isAdmin = session?.role === "ADMIN" || session?.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      
      {/* isAdmin bilgisini (true/false) Navbar'a prop olarak gönderiyoruz */}
      <Navbar isAdmin={isAdmin} />

      {/* İÇERİK ALANI */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-24 md:pb-6 max-w-5xl">
        {children}
      </main>
      
    </div>
  );
}