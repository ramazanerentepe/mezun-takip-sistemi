import React from "react";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { MapPin } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import CreatePostBox from "@/components/feed/CreatePostBox";

const prisma = new PrismaClient();

export default async function FeedPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const session = sessionCookie ? await decrypt(sessionCookie.value) : null;

  let dbUser = null;
  if (session?.userId) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { 
        profile: true,
        _count: { select: { following: true, followedBy: true } }
      },
    });
  }

  // 1. Gönderileri Çek (DÜZELTME BURADA: images: true eklendi)
  const dbPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { include: { profile: true } },
      images: true, // YENİ: Gönderiye ait fotoğrafları da veritabanından getir
      _count: { select: { likes: true, comments: true } }
    }
  });

  // (DÜZELTME BURADA: imageUrl yerine images dizisi aktarıldı)
  const formattedPosts = dbPosts.map(post => ({
    id: post.id,
    author: {
      name: `${post.author.profile?.firstName || "İsimsiz"} ${post.author.profile?.lastName || ""}`,
      title: post.author.profile?.academicTitle || "KTÜN Mezunu",
      avatarUrl: post.author.profile?.avatarUrl || "/logo.png",
    },
    content: post.content,
    images: post.images, // YENİ: Fotoğraf dizisini PostCard'a yolluyoruz
    likes: post._count.likes,
    comments: post._count.comments,
    time: new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(post.createdAt),
  }));

  // 2. Sağ Sütun İçin Duyuruları/Haberleri Çek
  const dbAnnouncements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 5, 
  });

  const profile = dbUser?.profile;

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#121212] pt-6 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* ======================= SOL SÜTUN (PROFİL ÖZETİ) ======================= */}
          <div className="hidden lg:block col-span-1 sticky top-24">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden transition-colors">
              <div className="h-16 w-full bg-red-600 dark:bg-red-700"></div>
              <div className="px-4 pb-4 flex flex-col items-center text-center -mt-10">
                <img
                  src={profile?.avatarUrl || "/logo.png"} 
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-[#1e1e1e] bg-white object-cover transition-colors"
                  alt="Profil"
                />
                <h2 className="mt-3 font-bold text-gray-900 dark:text-gray-100">
                  {profile ? `${profile.firstName} ${profile.lastName}` : "Kullanıcı"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{profile?.academicTitle || "KTÜN Mezunu"}</p>
              </div>
              
              <div className="border-t border-gray-100 dark:border-neutral-800 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center hover:bg-gray-50 dark:hover:bg-neutral-800 p-1 rounded transition cursor-pointer">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Bağlantılar</span>
                  <span className="text-red-600 dark:text-red-500 font-bold">{dbUser?._count?.followedBy || 0}</span>
                </div>
                {profile?.location && (
                  <div className="flex items-center text-gray-400 dark:text-gray-500"><MapPin className="w-3 h-3 mr-2" /> {profile.location}</div>
                )}
              </div>
            </div>
          </div>

          {/* ======================= ORTA SÜTUN (AKIŞ) ======================= */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <CreatePostBox currentUser={{
              firstName: profile?.firstName || "Mezun",
              avatarUrl: profile?.avatarUrl || "/logo.png"
            }} />
            
            {formattedPosts.length > 0 ? (
              formattedPosts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-neutral-800">
                Henüz hiç gönderi paylaşılmamış. İlk paylaşan sen ol!
              </div>
            )}
          </div>

          {/* ======================= SAĞ SÜTUN (HABERLER / DUYURULAR) ======================= */}
          <div className="hidden lg:block col-span-1 sticky top-24">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 transition-colors">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="w-1 h-4 bg-red-600 dark:bg-red-500 mr-2 rounded-full"></span>
                KTÜN Gündemi
              </h3>
              
              <div className="space-y-4 text-xs">
                {dbAnnouncements.length > 0 ? (
                  dbAnnouncements.map((announcement) => (
                    <a 
                      key={announcement.id} 
                      href={announcement.link || "#"} 
                      className="group block"
                    >
                      <p className="font-bold text-gray-800 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-2">
                        {announcement.title}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 mt-1">
                        {new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(announcement.createdAt)}
                      </p>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Şu an için yeni bir duyuru bulunmamaktadır.
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4 px-4">
              <p>KTÜN Mezun Takip Sistemi © 2024</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}