"use client";

import React from "react";
import { 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  FileText, 
  Bookmark
} from "lucide-react";
// YENİ BİLEŞENİ İÇERİ AKTARIYORUZ:
import PostCard from "@/components/feed/PostCard";

// --- MOCK VERİLER ---
const currentUser = {
  firstName: "Ramazan",
  lastName: "Erentepe",
  title: "Yazılım Mühendisi | Konya Teknik Üniversitesi Mezunu",
  avatarUrl: "https://i.pravatar.cc/150?img=11",
  coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop", 
  connections: 342,
  profileViews: 85,
};

const mockPosts = [
  {
    id: "1",
    author: {
      name: "Ayşe Demir",
      title: "Frontend Developer @ TechCorp",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
    content: "Bugün yeni bir projeye başladık! Mezunlarımızın birbirleriyle iletişimde kalabileceği, iş ilanlarını görebileceği harika bir sistem geliştiriyoruz. Kırmızı beyaz temamız da çok şık oldu! 🚀 #mezun #networking #react",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    likes: 124,
    comments: 18,
    time: "2 saat önce"
  },
  {
    id: "2",
    author: {
      name: "Prof. Dr. Mehmet Kaya",
      title: "Bilgisayar Mühendisliği Bölüm Başkanı",
      avatarUrl: "https://i.pravatar.cc/150?img=15",
    },
    content: "Sevgili mezunlarımız, bu yıl düzenleyeceğimiz 'Kariyer ve Teknoloji Zirvesi' için hazırlıklarımız devam ediyor. Sektörde deneyim kazanmış mezunlarımızı konuşmacı olarak aramızda görmekten mutluluk duyarız. Detaylı bilgi yakında paylaşılacaktır.",
    likes: 389,
    comments: 45,
    time: "5 saat önce"
  },
  {
    id: "3",
    author: {
      name: "Ali Yılmaz",
      title: "Siber Güvenlik Uzmanı",
      avatarUrl: "https://i.pravatar.cc/150?img=33",
    },
    content: "Konya Teknik Üniversitesi'ndeki genç mühendis adaylarıyla buluşmak harikaydı. Gelecek nesil çok parlak!",
    likes: 210,
    comments: 32,
    time: "10 saat önce"
  }
];

const mockNews = [
  { id: 1, title: "Teknopark'ta yeni kuluçka merkezi açıldı", time: "1 gün önce" },
  { id: 2, title: "Mezunlar derneği burs başvuruları başladı", time: "2 gün önce" },
  { id: 3, title: "Yapay Zeka semineri büyük ilgi gördü", time: "3 gün önce" },
  { id: 4, title: "Bahar şenlikleri takvimi belli oldu", time: "5 gün önce" },
];

export default function FeedPage() {
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-[#0a0a0a] pt-6 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start w-full">
          
          {/* ======================= 1. SÜTUN: SOL (PROFİL) ======================= */}
          <div className="hidden lg:block col-span-1 h-max sticky top-6 space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
              <div 
                className="h-16 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${currentUser.coverUrl})` }}
              ></div>
              <div className="px-4 pb-4 flex flex-col items-center text-center relative mt-[-2rem]">
                <img 
                  src={currentUser.avatarUrl} 
                  alt="Profil" 
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-neutral-900 bg-white"
                />
                <h2 className="mt-2 font-semibold text-lg text-gray-900 dark:text-white hover:underline cursor-pointer">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {currentUser.title}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-neutral-800 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 p-1 rounded transition">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Profil görüntülenmesi</span>
                  <span className="text-red-600 font-semibold">{currentUser.profileViews}</span>
                </div>
                <div className="flex justify-between items-center text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 p-1 rounded transition">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Bağlantılar</span>
                  <span className="text-red-600 font-semibold">{currentUser.connections}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-neutral-800 p-4">
                <button className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition">
                  <Bookmark className="w-4 h-4 mr-2" /> Kaydedilen öğelerim
                </button>
              </div>
            </div>
          </div>

          {/* ======================= 2. SÜTUN: ORTA (AKIŞ) ======================= */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            
            {/* Gönderi Oluşturma Kutusu */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full" />
                <button className="flex-1 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-left px-4 py-3 rounded-full text-gray-500 dark:text-gray-400 text-sm font-medium transition border border-gray-200 dark:border-neutral-700">
                  Ne düşünüyorsunuz, {currentUser.firstName}?
                </button>
              </div>
              <div className="flex justify-between items-center px-2">
                <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition group">
                  <ImageIcon className="text-red-500 group-hover:text-red-600 w-5 h-5" />
                  <span className="font-medium">Fotoğraf</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition group">
                  <Video className="text-red-500 group-hover:text-red-600 w-5 h-5" />
                  <span className="font-medium hidden sm:block">Video</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition group">
                  <Calendar className="text-red-500 group-hover:text-red-600 w-5 h-5" />
                  <span className="font-medium hidden sm:block">Etkinlik</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition group">
                  <FileText className="text-red-500 group-hover:text-red-600 w-5 h-5" />
                  <span className="font-medium">Yazı</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 my-2">
              <hr className="flex-grow border-gray-300 dark:border-neutral-800" />
              <span className="text-xs text-gray-500">Sıralama ölçütü: <strong className="text-gray-900 dark:text-white">En Önemli</strong></span>
            </div>

            {/* SOLID PRENSİBİ BURADA DEVREYE GİRİYOR: Sadece Componenti Çağırıyoruz */}
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

          </div>

          {/* ======================= 3. SÜTUN: SAĞ (HABERLER) ======================= */}
          <div className="hidden lg:block col-span-1 h-max sticky top-6 space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Üniversite & Mezun Haberleri</h2>
              <ul className="space-y-4">
                {mockNews.map((news) => (
                  <li key={news.id} className="cursor-pointer group">
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2 mt-1">•</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-500 group-hover:underline line-clamp-2">
                          {news.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{news.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="mt-4 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 w-full py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                Tüm Haberleri Gör
              </button>
            </div>
            
            <div className="text-center text-xs text-gray-500 mt-4 px-4">
              <p>Konya Teknik Üniversitesi Mezun Takip Sistemi © 2024</p>
              <div className="flex justify-center space-x-2 mt-2">
                <a href="#" className="hover:text-red-600 transition">Hakkımızda</a>
                <span>•</span>
                <a href="#" className="hover:text-red-600 transition">Yardım</a>
                <span>•</span>
                <a href="#" className="hover:text-red-600 transition">Gizlilik</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}