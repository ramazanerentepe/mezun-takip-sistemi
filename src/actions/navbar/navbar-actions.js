"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Gelişmiş Kullanıcı Arama Fonksiyonu 
 * @param {string} searchTerm - Aranan kelime(ler)
 * @param {number} page - Sayfa numarası (Sonsuz kaydırma/Infinite Scroll için)
 * @param {number} limit - Bir kerede çekilecek kayıt sayısı 
 */
export async function searchUsersAction(searchTerm, page = 1, limit = 20) {
  if (!searchTerm || searchTerm.trim() === "") return [];

  const term = searchTerm.trim();
  const terms = term.split(/\s+/); // Girilen metni boşluklara göre ayır
  const isYear = /^\d{4}$/.test(term); // 4 haneli bir sayı mı? (Mezuniyet yılı kontrolü)
  const skip = (page - 1) * limit;

  try {
    let whereCondition = { OR: [] };

    // 1. DURUM: Arama metni 4 haneli bir sayıysa (Mezuniyet Yılı İhtimali)
    if (isYear) {
      whereCondition.OR.push({ graduationYear: parseInt(term) });
    }

    // 2. DURUM: Arama metninde birden fazla kelime varsa (İsim + Soyisim veya Uzun Şirket Adı)
    if (terms.length >= 2) {
      whereCondition.OR.push({
        AND: [
          { firstName: { contains: terms[0], mode: "insensitive" } },
          // İlk kelimeden sonrakileri birleştirip soyadı olarak ara (Örn: "Ramazan Eren Tepe")
          { lastName: { contains: terms.slice(1).join(" "), mode: "insensitive" } }
        ]
      });
      // Belki şirket adı iki kelimedir (Örn: "Türk Telekom")
      whereCondition.OR.push({
        experiences: { some: { company: { contains: term, mode: "insensitive" } } }
      });
    } 
    // 3. DURUM: Tek kelime aratılıyorsa (Bağımsız Arama)
    else {
      whereCondition.OR.push({ firstName: { contains: term, mode: "insensitive" } });
      whereCondition.OR.push({ lastName: { contains: term, mode: "insensitive" } });
      whereCondition.OR.push({ 
        experiences: { some: { company: { contains: term, mode: "insensitive" } } } 
      });
    }

    // Veritabanı Sorgusu
    const results = await prisma.profile.findMany({
      where: whereCondition,
      include: {
        user: {
          select: { 
            role: true, 
            profileImage: true,
            // Popülerliği hesaplamak için "Beni Takip Edenler (followedBy)" sayısını çekiyoruz
            _count: { select: { followedBy: true } } 
          }
        },
        experiences: {
          select: { company: true, title: true },
          orderBy: { startDate: 'desc' }, // En güncel iş deneyimini başa al
          take: 1 // Listelemede sadece en güncel şirketini göstermek için
        }
      },
      orderBy: {
        // Sonuçları popülerliğe (takipçi sayısına) göre çoktan aza sırala
        user: {
          followedBy: {
            _count: 'desc'
          }
        }
      },
      skip: skip,
      take: limit, // İlk 10 yerine dinamik limit (örn: aşağı kaydırdıkça +20 getir)
    });

    return results;

  } catch (error) {
    console.error("Gelişmiş arama hatası:", error);
    return [];
  }
}