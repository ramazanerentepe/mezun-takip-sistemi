"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/send-mail";

const prisma = new PrismaClient();

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    throw new Error("Bu işlemi yapmak için yetkiniz yok.");
  }
  return session;
}

export async function approveUser(userId) {
  try {
    await checkAdminAuth();
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdminApproved: true },
      include: {
        profile: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    try {
      const fullName = updatedUser.profile 
        ? `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}` 
        : "Değerli Mezunumuz";
      
      await sendMail({
        to: updatedUser.email,
        subject: "Hesabınız Onaylandı - Mezun Takip Sistemi",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #9d182e;">Tebrikler, ${fullName}!</h2>
            <p>Mezun Takip Sistemi hesabınız yönetici tarafından başarıyla onaylanmıştır.</p>
            <p>Artık platforma giriş yapabilir, mezun ağına katılabilir ve tüm özelliklerden faydalanabilirsiniz.</p>
            <br>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: #9d182e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sisteme Giriş Yap</a></p>
            <br>
            <p>İyi günler dileriz.</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Mail Error:", mailError);
    }
    
    revalidatePath("/users"); 
    return { success: true };
  } catch (error) {
    return { error: error.message || "Hata oluştu." };
  }
}

export async function deleteUser(userId, reason) {
  try {
    const adminSession = await checkAdminAuth();
    const adminUser = await prisma.user.findUnique({
      where: { id: adminSession.userId },
      select: { 
        email: true, 
        profile: { select: { firstName: true, lastName: true } } 
      }
    });

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true, 
        profile: { select: { firstName: true, lastName: true } } 
      }
    });

    if (!targetUser) {
      throw new Error("Silinecek kullanıcı bulunamadı.");
    }

    await prisma.user.delete({
      where: { id: userId },
    });
    
    try {
      const targetName = targetUser.profile ? `${targetUser.profile.firstName} ${targetUser.profile.lastName}` : "Değerli Kullanıcımız";
      const adminName = adminUser?.profile ? `${adminUser.profile.firstName} ${adminUser.profile.lastName}` : "Sistem Yöneticisi";
      const adminEmail = adminUser?.email || "Belirtilmedi";
      const deleteReason = reason || "Yönetici tarafından belirtilmedi.";

      await sendMail({
        to: targetUser.email,
        subject: "Hesabınız Silindi - Mezun Takip Sistemi",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #9d182e;">Merhaba ${targetName},</h2>
            <p>Mezun Takip Sistemi hesabınız sistem yöneticisi tarafından silinmiştir.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #9d182e; margin: 20px 0;">
              <strong>Silme Sebebi:</strong><br/>
              ${deleteReason}
            </div>
            
            <p>Bu işlemle veya hesabınızla ilgili bir sorunuz varsa, işlemi gerçekleştiren yönetici ile iletişime geçebilirsiniz:</p>
            <ul>
              <li><strong>Yönetici:</strong> ${adminName}</li>
              <li><strong>İletişim Maili:</strong> <a href="mailto:${adminEmail}">${adminEmail}</a></li>
            </ul>
            <br>
            <p>İyi günler dileriz.</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Mail Error:", mailError);
    }

    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { error: error.message || "Hata oluştu." };
  }
}

export async function updateUserRole(userId, newRole) {
  try {
    const adminSession = await checkAdminAuth();
    
    if (adminSession.role !== "SUPER_ADMIN" && newRole === "SUPER_ADMIN") {
      throw new Error("Yetkisiz işlem.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { error: error.message || "Hata oluştu." };
  }
}