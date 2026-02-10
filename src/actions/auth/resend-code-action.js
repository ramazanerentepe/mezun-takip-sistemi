"use server";

import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/send-mail";

const prisma = new PrismaClient();

export async function resendCodeAction(email) {
  try {
    if (!email) {
      return { success: false, message: "E-posta adresi bulunamadı." };
    }

    // 1. Kullanıcıyı Bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı." };
    }

    if (user.isEmailVerified) {
      return { success: false, message: "Bu hesap zaten doğrulanmış." };
    }

    // 2. Yeni Kod Üret
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    for (let i = 0; i < 6; i++) {
      verificationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Süre: Şu an + 3 Dakika
    const codeExpiry = new Date(Date.now() + 3 * 60 * 1000);

    // 3. Veritabanını Güncelle
    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: verificationCode,
        verificationCodeExpiry: codeExpiry,
      },
    });

    // 4. Mail Gönder
    await sendMail({
      to: email,
      subject: "Yeni Doğrulama Kodunuz - Mezun Takip Sistemi",
      html: `
        <h3>Doğrulama Kodunuz Yenilendi</h3>
        <p>İsteğiniz üzerine yeni bir doğrulama kodu oluşturuldu:</p>
        <h1 style="color: #2563EB; letter-spacing: 5px;">${verificationCode}</h1>
        <p>Bu kod 3 dakika süreyle geçerlidir.</p>
      `,
    });

    return { success: true, message: "Yeni kod e-posta adresinize gönderildi." };

  } catch (error) {
    console.error("Kod Gönderme Hatası:", error);
    return { success: false, message: "Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin." };
  }
}