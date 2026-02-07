"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyAction(email, code) {
  try {
    // 1. E-posta boş mu kontrol et
    if (!email) {
      return { success: false, message: "E-posta bilgisi eksik. Lütfen tekrar giriş yapın." };
    }

    // 2. Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı." };
    }

    // 3. Kullanıcı zaten doğrulanmış mı?
    if (user.isVerified) {
      return { success: true, message: "Hesabınız zaten doğrulanmış. Giriş yapabilirsiniz." };
    }

    // 4. Kod Kontrolü (Veritabanındaki kod ile girilen kod eşleşiyor mu?)
    // Not: Kodlar büyük/küçük harf duyarlı olabilir, ikisini de garantiye alalım.
    if (user.verificationCode !== code) {
      return { success: false, message: "Hatalı doğrulama kodu." };
    }

    // 5. Süre Kontrolü (Kodun süresi dolmuş mu?)
    if (new Date() > new Date(user.verificationCodeExpiry)) {
      return { success: false, message: "Kodun süresi dolmuş. Lütfen tekrar kod isteyiniz." };
    }

    // 6. BAŞARILI! Kullanıcıyı güncelle
    await prisma.user.update({
      where: { email: email },
      data: {
        isVerified: true,           // Artık onaylı
        verificationCode: null,     // Kodu sil (tek kullanımlık olsun)
        verificationCodeExpiry: null // Süreyi sil
      }
    });

    return { success: true, message: "Hesap başarıyla doğrulandı!" };

  } catch (error) {
    console.error("Doğrulama Hatası:", error);
    return { success: false, message: "Sunucu hatası oluştu." };
  }
}