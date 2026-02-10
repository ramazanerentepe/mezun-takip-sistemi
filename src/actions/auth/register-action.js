"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/send-mail"; 

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; // Hash derecesi 

export async function registerAction(data) {
  try {
    // 1. Mükerrer Kayıt Kontrolü (Sadece E-posta)
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      }
    });

    if (existingUser) {
      return { success: false, message: "Bu e-posta adresi zaten kayıtlı." };
    }

    // 2. Şifreleme 
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // 3. Doğrulama Kodu Üretme (6 haneli)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    for (let i = 0; i < 6; i++) {
      verificationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const codeExpiry = new Date(Date.now() + 3 * 60 * 1000); // 3 dakika geçerli

    // 4. Veritabanına Kayıt
    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.userRole, 
        
        // --- ÇİFT AŞAMALI ONAY SİSTEMİ ---
        isEmailVerified: false, // 1. Aşama: E-posta onayı bekliyor
        isAdminApproved: false, // 2. Aşama: Admin onayı bekliyor
        
        verificationCode: verificationCode,
        verificationCodeExpiry: codeExpiry,
        
        // İlişkili Profil Tablosunu Oluşturma
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            // Eğer Mezun ise mezuniyet yılını ekle
            ...(data.userRole === "GRADUATE" && {
                graduationYear: data.graduationYear 
            }),
            // Eğer Akademisyen ise unvanı ekle
            ...(data.userRole === "ACADEMIC" && {
                academicTitle: data.academicTitle
            })
          }
        }
      }
    });

    // 5. Doğrulama Maili Gönderme
    await sendMail({
      to: data.email,
      subject: "Mezun Takip Sistemi - E-posta Doğrulama",
      html: `
        <h3>Hoş Geldiniz, ${data.firstName} ${data.lastName}</h3>
        <p>Kaydınızı tamamlamak için e-posta adresinizi doğrulamanız gerekmektedir.</p>
        <p>Doğrulama kodunuz:</p>
        <h1 style="color: #2563EB; letter-spacing: 5px;">${verificationCode}</h1>
        <p><strong>Bilgilendirme:</strong> E-postanızı doğruladıktan sonra hesabınız <u>yönetici onayına</u> düşecektir. Yöneticiler tarafından onaylandıktan sonra giriş yapabilirsiniz.</p>
        <br>
        <p>Bu kod 3 dakika süreyle geçerlidir.</p>
      `
    });

    return { 
      success: true, 
      message: "Kayıt başarılı! Lütfen e-posta adresinize gelen kodu giriniz." 
    };

  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return { success: false, message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz." };
  }
}