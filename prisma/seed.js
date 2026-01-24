// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 YÖK Atlas verileri ile tohumlama başladı...');

  // --- 1. ENV KONTROLLERİ ---
  const adminEmail = process.env.ADMIN_EMAIL;       // .env'den maili al
  const adminPassword = process.env.ADMIN_PASSWORD; // .env'den şifreyi al

  if (!adminEmail || !adminPassword) {
    throw new Error('❌ HATA: .env dosyasında ADMIN_EMAIL veya ADMIN_PASSWORD eksik!');
  }

  // --- 2. RESMİ BÖLÜM LİSTESİ ---
  const departments = [
    // Lisans
    "Bilgisayar Mühendisliği",
    "Elektrik-Elektronik Mühendisliği",
    "Endüstri Mühendisliği",
    "Harita Mühendisliği",
    "İnşaat Mühendisliği",
    "Jeoloji Mühendisliği",
    "Kimya Mühendisliği",
    "Makine Mühendisliği",
    "Metalurji ve Malzeme Mühendisliği",
    "Yazılım Mühendisliği",
    "Yapay Zeka ve Makine Öğrenmesi",
    "Mimarlık", "İç Mimarlık",
    "Şehir ve Bölge Planlama",
    // Önlisans
    "Bilgisayar Programcılığı",
    "Elektrik",
    "Elektronik Teknolojisi",
    "Elektronik Haberleşme Teknolojisi",
    "Kontrol ve Otomasyon Teknolojisi",
    "Makine", "Makine Resim ve Konstrüksiyonu",
    "Tarım Makineleri",
    "İnşaat Teknolojisi",
    "Yapı Yalıtım Teknolojisi",
    "Harita ve Kadastro",
    "Gıda Teknolojisi",
    "Kimya Teknolojisi",
    "İş Sağlığı ve Güvenliği",
    "İklimlendirme ve Soğutma Teknolojisi",
    "Mobilya ve Dekorasyon",
    "Basım ve Yayım Teknolojileri",
    "Giyim Üretim Teknolojisi",
    "Ayakkabı Tasarım ve Üretimi",
    "Kuyumculuk ve Takı Tasarımı", 
    "Nükleer Teknoloji ve Radyasyon Güvenliği"
  ];

  console.log(`📌 Toplam ${departments.length} bölüm kontrol ediliyor...`);

  for (const deptName of departments) {
    // KORUMA KILKANI: Eğer isim boşsa veya tanımsızsa o satırı atla
    if (!deptName) {
      console.warn('⚠️ Boş veya geçersiz bir bölüm ismi atlandı.');
      continue;
    }

    await prisma.department.upsert({
      where: { name: deptName },
      update: {}, 
      create: { name: deptName },
    });
  }
  console.log('✅ Bölümler tamam.');

  // --- 3. SÜPER ADMIN ---
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail }, // Maili değişkenden alıyoruz
    update: {
       password: hashedPassword // Şifreyi günceller (tekrar çalıştırırsan)
    }, 
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
      departmentId: null,
      profile: {
        create: {
          firstName: 'Sistem',
          lastName: 'Yöneticisi',
          bio: 'KTÜN Mezun Takip Sistemi Ana Yöneticisi',
        }
      }
    },
  });

  console.log(`👤 Süper Admin Hazır: ${admin.email}`);
  console.log('🚀 Tohumlama işlemi başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });