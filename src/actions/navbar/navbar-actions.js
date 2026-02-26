"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

// PrismaClient'ın globalde tekil (singleton) olarak tutulması Next.js hot-reload süreçlerinde
// bağlantı sızıntılarını (connection leak) önlemek için en iyi pratiktir. 
// Projende global bir prisma dosyan varsa oradan import edebilirsin. Şimdilik standart başlatıyoruz.
const prisma = new PrismaClient();

/**
 * Gelişmiş Kullanıcı ve Mezun Arama Servisi (Heuristic Search Engine)
 * * Bu fonksiyon, kullanıcının girdiği metni analiz ederek (isim-soyad, yıl, şirket)
 * en olası sonuçları popülerlik (takipçi sayısı) sırasına göre döndürür.
 * * @param {string} searchTerm - Aranan ham metin girdisi.
 * @param {number} page - Sayfalandırma için sayfa numarası (Varsayılan: 1).
 * @param {number} limit - Her sorguda getirilecek maksimum kayıt sayısı (Varsayılan: 20).
 * @returns {Promise<Array>} - Bulunan profillerin ve ilişkili verilerin dizisi.
 */
export async function searchUsersAction(searchTerm, page = 1, limit = 20) {
  // 1. Güvenlik ve Validasyon (Input Sanitization)
  if (!searchTerm || typeof searchTerm !== "string") return [];
  
  let term = searchTerm.trim();
  if (term === "") return [];

  // ReDoS (Düzenli İfade Hizmet Reddi) ve aşırı yüklenmeleri önlemek için arama terimini sınırla
  if (term.length > 50) term = term.substring(0, 50);

  // 2. Metin Analizi ve Veri Çıkarımı
  const terms = term.split(/\s+/); // Kullanıcı girdisini kelimelere böl (Örn: "Ramazan Eren" -> ["Ramazan", "Eren"])
  const isYear = /^\d{4}$/.test(term); // Sadece 4 haneli bir rakam mı? (Mezuniyet yılı tahmini)
  
  // Sayfalandırma (Pagination) ofset hesaplaması
  const skip = (page - 1) * limit;

  try {
    // Prisma OR (Veya) sorgu yapısını başlatıyoruz
    let whereCondition = { OR: [] };

    // DURUM A: Girdi bir yıl ise, doğrudan mezuniyet yılı ile eşleştirme ihtimalini ekle.
    if (isYear) {
      whereCondition.OR.push({ graduationYear: parseInt(term) });
    }

    // DURUM B: Birden fazla kelime girildiyse (İsim + Soyisim formatı veya Uzun Şirket Adı)
    if (terms.length >= 2) {
      whereCondition.OR.push({
        AND: [
          // İlk kelimeyi ad olarak kabul et
          { firstName: { contains: terms[0], mode: "insensitive" } },
          // Kalan kelimeleri birleştirip soyad olarak ara (Örn: İkinci isim veya uzun soyisimler için)
          { lastName: { contains: terms.slice(1).join(" "), mode: "insensitive" } }
        ]
      });
      // Ayrıca bu kelime öbeği bir şirket adı olabilir (Örn: "Türk Telekom")
      whereCondition.OR.push({
        experiences: { some: { company: { contains: term, mode: "insensitive" } } }
      });
    } 
    // DURUM C: Tek kelime girildiyse, tüm olası sütunlarda bağımsız arama yap
    else {
      whereCondition.OR.push({ firstName: { contains: term, mode: "insensitive" } });
      whereCondition.OR.push({ lastName: { contains: term, mode: "insensitive" } });
      whereCondition.OR.push({ 
        experiences: { some: { company: { contains: term, mode: "insensitive" } } } 
      });
    }

    // 3. Veritabanı Sorgusu ve Optimizasyon
    const results = await prisma.profile.findMany({
      where: whereCondition,
      include: {
        user: {
          select: { 
            role: true, 
            profileImage: true,
            // Popülerlik hesaplaması için maliyetli bir 'include' yerine sadece '_count' alıyoruz (Performans artışı)
            _count: { select: { followedBy: true } } 
          }
        },
        experiences: {
          select: { company: true, title: true },
          orderBy: { startDate: 'desc' }, // Sadece en güncel/son iş deneyimini getir
          take: 1 
        }
      },
      orderBy: {
        // İNSTAGRAM MANTIĞI: Sonuçları her zaman en çok takip edilen kişiden en aza doğru sırala
        user: {
          followedBy: {
            _count: 'desc'
          }
        }
      },
      skip: skip,
      take: limit,
    });

    return results;

  } catch (error) {
    // Üretim (Production) ortamında hata loglarını izleme servislerine (Sentry vb.) göndermek idealdir.
    console.error("[Search Service Error] Gelişmiş arama sırasında bir hata oluştu:", error);
    return []; // Uygulamanın çökmesini engellemek için sessizce boş dizi dön
  }
}

/**
 * Aktif Kullanıcının Bildirimlerini Getiren Servis
 * * Şu an sistemde ayrı bir "Notification" tablosu bulunmadığı için,
 * takip (Follows) tablosundaki en son hareketler bildirim olarak yorumlanmaktadır.
 * * @returns {Promise<Array>} - Bildirim objelerinden oluşan dizi.
 */
export async function getNotificationsAction() {
  try {
    // Oturum (Session) kontrolü
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return [];

    const session = await decrypt(token);
    if (!session?.userId) return [];

    // Beni en son takip eden 5 kişiyi getir
    const recentFollowers = await prisma.follows.findMany({
      where: { followingId: session.userId },
      include: {
        follower: {
          include: { profile: true } // Takip edenin adını, soyadını ve resmini alabilmek için
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5 
    });

    // Veritabanından gelen raw datayı, Frontend'in beklediği temiz UI objesine dönüştür (Data Transformation)
    const notifications = recentFollowers.map(f => ({
      id: `follow_${f.followerId}`,
      actorName: `${f.follower.profile?.firstName || 'Bir'} ${f.follower.profile?.lastName || 'Kullanıcı'}`.trim(),
      actorImage: f.follower.profileImage,
      message: "ağınıza katılmak istiyor.", // Sabit mesaj
      time: f.createdAt,
    }));

    return notifications;

  } catch (error) {
    console.error("[Notification Service Error] Bildirimleri çekerken bir hata oluştu:", error);
    return [];
  }
}