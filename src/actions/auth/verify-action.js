"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyAction(email, code) {
  try {
    if (!email) {
      return { success: false, message: "E-posta bilgisi eksik. Lütfen tekrar giriş yapın." };
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı." };
    }

    if (user.isEmailVerified) {
      return { success: true, message: "Hesabınız zaten doğrulanmış. Giriş yapabilirsiniz." };
    }

    if (user.verificationCode !== code) {
      return { success: false, message: "Hatalı doğrulama kodu." };
    }

    if (new Date() > new Date(user.verificationCodeExpiry)) {
      return { success: false, message: "Kodun süresi dolmuş. Lütfen tekrar kod isteyiniz." };
    }

    await prisma.user.update({
      where: { email: email },
      data: {
        isEmailVerified: true, 
        verificationCode: null,
        verificationCodeExpiry: null 
      }
    });

    return { success: true, message: "Hesap başarıyla doğrulandı!" };

  } catch (error) {
    console.error("Doğrulama Hatası:", error);
    return { success: false, message: "Sunucu hatası oluştu." };
  }
}