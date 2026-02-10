const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Veritabanı tohumlama işlemi başladı...');

  // --- 1. ENV KONTROLLERİ ---
  const adminEmail = process.env.ADMIN_EMAIL;       // .env'den maili al
  const adminPassword = process.env.ADMIN_PASSWORD; // .env'den şifreyi al

  if (!adminEmail || !adminPassword) {
    throw new Error('❌ HATA: .env dosyasında ADMIN_EMAIL veya ADMIN_PASSWORD eksik!');
  }

  // --- 2. SÜPER ADMIN OLUŞTURMA ---
  console.log('👤 Süper Admin yapılandırılıyor...');
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      // Eğer veritabanında varsa bile bu değerleri true yapalım ki admin kilitli kalmasın
      isEmailVerified: true,
      isAdminApproved: true, 
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      
      // --- YENİ ONAY SİSTEMİ ---
      // Admin doğuştan onaylı gelir
      isEmailVerified: true,
      isAdminApproved: true,
      
      // Profil Oluşturma
      profile: {
        create: {
          firstName: 'Sistem',
          lastName: 'Yöneticisi',
          bio: 'KTÜN Mezun Takip Sistemi Ana Yöneticisi',
        }
      }
    },
  });

  console.log(`✅ Süper Admin Hazır: ${admin.email}`);
  console.log('🚀 Tohumlama işlemi başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Tohumlama hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });