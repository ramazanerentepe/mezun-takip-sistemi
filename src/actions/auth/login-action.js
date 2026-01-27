"use server"; // Bu satır, bu kodun SADECE sunucuda çalışacağını garanti eder.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Şifre karşılaştırma kütüphanesi

const prisma = new PrismaClient();

export async function loginAction(formData) {
  // 1. Formdan gelen verileri alalım
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // 2. VERİTABANI SORGUSU 
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        profile: true, // Profil resmini vs. de alalım
      }
    });

    // 3. Kullanıcı yoksa hemen reddet
    if (!user) {
      return { success: false, message: "Böyle bir kullanıcı bulunamadı." };
    }

    // 4. ŞİFRE KONTROLÜ (Hash Karşılaştırma)
    // Kullanıcının girdiği 'password' (123456) ile veritabanındaki hash'i karşılaştırır.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Şifre hatalı!" };
    }

    // 5. Giriş Başarılı! (Burada sadece onay dönüyoruz)
    // Not: Session/Cookie işlemini NextAuth kurulumunda yapacağız.
    // Şimdilik sadece doğrulama yapıyoruz.
    return { 
      success: true, 
      message: "Giriş başarılı! Yönlendiriliyorsunuz...",
      userRole: user.role 
    };

  } catch (error) {
    console.error("Giriş Hatası:", error);
    return { success: false, message: "Sunucu hatası oluştu." };
  }
}