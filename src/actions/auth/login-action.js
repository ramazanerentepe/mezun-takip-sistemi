"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Kullanıcı giriş işlemini yönetir.
 * - Kimlik doğrulama (Email/Şifre)
 * - Hesap durum kontrolü (Email Onayı & Admin Onayı)
 * * @param {FormData} formData
 */
export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // Kullanıcıyı ve gerekli profil ilişkilerini getir
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true } 
    });

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı." };
    }

    // Şifre doğrulaması
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Hatalı şifre." };
    }

    // --- Güvenlik & Erişim Kontrolleri ---

    // 1. E-posta Doğrulaması
    if (!user.isEmailVerified) {
      return { 
        success: false, 
        message: "Lütfen önce e-posta adresinizi doğrulayınız." 
      };
    }

    // 2. Yönetici Onayı (Kapalı Devre Sistem)
    if (!user.isAdminApproved) {
      return { 
        success: false, 
        message: "Hesabınız henüz yönetici onayı almamıştır. Erişim izni bekleniyor." 
      };
    }

    return { 
      success: true, 
      message: "Giriş başarılı.",
      userRole: user.role 
    };

  } catch (error) {
    console.error("[LoginAction] Error:", error);
    return { success: false, message: "Sunucu tarafında bir hata oluştu." };
  }
}