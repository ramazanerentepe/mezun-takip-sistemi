"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/send-mail"; 

const prisma = new PrismaClient();

//Üniversite veri tabanı diploma no isim soyisim sorgusu Devamlı true döner ilerde erişim gelince düzelt.
async function verifyWithExternalDatabase(diplomaNo, name, surname , graduationYear) {
      return { valid: true };
}

export async function registerAction(data) {
  try {
    // A. AKADEMİSYEN ENGELİ (Şimdilik)
    if (data.userRole === "ACADEMIC") {
      return {
        success: false,
        message: "Akademisyen kayıtları şu anda sadece Yönetici onayı ile veya manuel olarak yapılmaktadır. Lütfen bölüm sekreterliği ile iletişime geçiniz."
      };
    }

    // B. DIŞ VERİ TABANI DOĞRULAMASI (Sadece Mezunlar için)
    if (data.userRole === "GRADUATE") {
      const externalCheck = await verifyWithExternalDatabase(
        data.diplomaNo, 
        data.firstName, 
        data.lastName,
        data.graduationYear
      );

      if (!externalCheck.valid) {
        return { success: false, message: externalCheck.message };
      }
    }

    // C. İÇ VERİ TABANI KONTROLÜ (Mükerrer Kayıt)
    // Mail veya Diploma No daha önce kullanılmış mı?
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { diplomaNo: data.diplomaNo } // null ise sorun olmaz, Prisma bunu yönetir
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return { success: false, message: "Bu e-posta adresi zaten kayıtlı." };
      }
      if (existingUser.diplomaNo === data.diplomaNo) {
        return { success: false, message: "Bu diploma numarası ile daha önce kayıt olunmuş." };
      }
    }

    // D. ŞİFRELEME VE KOD ÜRETME
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // 6 haneli doğrulama kodu
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    
    // 6 kere dönüp havuzdan rastgele bir karakter seçiyoruz
    for (let i = 0; i < 6; i++) {
      verificationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Kod geçerlilik süresi (Örn: 15 dakika sonrası)
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); 

    // E. KAYIT İŞLEMİ (User + Profile)
    // Prisma'da iç içe yazarak transaction bütünlüğü sağlarız.
    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "GRADUATE",
        isVerified: false, // Henüz doğrulanmadı
        departmentId: data.departmentId,
        diplomaNo: data.diplomaNo,
        verificationCode: verificationCode,
        verificationCodeExpiry: codeExpiry,
        
        // Kullanıcı ile birlikte boş profilini de oluşturalım
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            graduationYear: data.graduationYear,
            // Diğer alanlar null kalabilir şimdilik
          }
        }
      }
    });

    // F. DOĞRULAMA MAİLİ GÖNDERME
    await sendMail({
      to: data.email,
      subject: "Mezun Takip Sistemi - Doğrulama Kodu",
      html: `
        <h3>Aramıza Hoş Geldin, ${data.firstName}!</h3>
        <p>Kaydını tamamlamak için doğrulama kodun aşağıdadır:</p>
        <h1 style="color: #2563EB; letter-spacing: 5px;">${verificationCode}</h1>
        <p>Bu kod 15 dakika boyunca geçerlidir.</p>
        <br>
        <p>İyi günler dileriz.</p>
      `
    });

    return { 
      success: true, 
      message: "Kayıt başarılı! Lütfen e-posta adresinize gelen kodu giriniz." 
    };

  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return { success: false, message: "Sunucu tarafında bir hata oluştu." };
  }
}