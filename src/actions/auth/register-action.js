"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/send-mail"; 

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// YARDIMCI FONKSİYON: İsimleri düzeltir (mehmet ali -> Mehmet Ali)
const formatName = (name) => {
  if (!name) return "";
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export async function registerAction(data) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      }
    });

    if (existingUser) {
      return { success: false, message: "Bu e-posta adresi zaten kayıtlı." };
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    for (let i = 0; i < 6; i++) {
      verificationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const codeExpiry = new Date(Date.now() + 3 * 60 * 1000);

    // İSİMLERİ FORMATLA
    const formattedFirstName = formatName(data.firstName);
    const formattedLastName = formatName(data.lastName);

    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.userRole, 
        
        isEmailVerified: false,
        isAdminApproved: false,
        
        verificationCode: verificationCode,
        verificationCodeExpiry: codeExpiry,
        
        profile: {
          create: {
            firstName: formattedFirstName, // Düzeltilmiş İsim
            lastName: formattedLastName,   // Düzeltilmiş Soyisim
            
            ...(data.userRole === "GRADUATE" && {
                graduationYear: data.graduationYear 
            }),
            ...(data.userRole === "ACADEMIC" && {
                academicTitle: data.academicTitle
            })
          }
        }
      }
    });

    await sendMail({
      to: data.email,
      subject: "Mezun Takip Sistemi - E-posta Doğrulama",
      html: `
        <h3>Hoş Geldiniz, ${formattedFirstName} ${formattedLastName}</h3>
        <p>Kaydınızı tamamlamak için e-posta adresinizi doğrulamanız gerekmektedir.</p>
        <p>Doğrulama kodunuz:</p>
        <h1 style="color: #2563EB; letter-spacing: 5px;">${verificationCode}</h1>
        <p><strong>Bilgilendirme:</strong> E-postanızı doğruladıktan sonra hesabınız yönetici onayına düşecektir.</p>
      `
    });

    return { 
      success: true, 
      message: "Kayıt başarılı! Lütfen e-posta adresinize gelen kodu giriniz." 
    };

  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return { success: false, message: "Sunucu hatası oluştu." };
  }
}