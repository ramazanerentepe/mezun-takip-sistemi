"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/send-mail";
import { getUserApprovedEmailTemplate, getUserDeletedEmailTemplate } from "@/lib/mail-templates";

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
    const session = await checkAdminAuth();
    
    if (session.userId === userId) {
      throw new Error("Kendi hesabınız üzerinde işlem yapamazsınız.");
    }

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
      
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      await sendMail({
        to: updatedUser.email,
        subject: "Hesabınız Onaylandı - Mezun Takip Sistemi",
        html: getUserApprovedEmailTemplate(fullName, appUrl)
      });
    } catch (mailError) {
      console.error(mailError);
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

    if (adminSession.userId === userId) {
      throw new Error("Kendi hesabınızı silemezsiniz.");
    }

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
        role: true,
        email: true, 
        profile: { select: { firstName: true, lastName: true } } 
      }
    });

    if (!targetUser) {
      throw new Error("Silinecek kullanıcı bulunamadı.");
    }

    if (adminSession.role === "ADMIN" && targetUser.role === "SUPER_ADMIN") {
      throw new Error("Süper Admin hesabını silmeye yetkiniz yok.");
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
        html: getUserDeletedEmailTemplate(targetName, deleteReason, adminName, adminEmail)
      });
    } catch (mailError) {
      console.error(mailError);
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
    
    if (adminSession.userId === userId) {
      throw new Error("Kendi yetkinizi değiştiremezsiniz.");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!targetUser) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    if (adminSession.role === "ADMIN") {
      if (targetUser.role === "SUPER_ADMIN") {
        throw new Error("Süper Admin'in yetkisini değiştiremezsiniz.");
      }
      if (newRole === "SUPER_ADMIN") {
        throw new Error("Süper Admin yetkisi veremezsiniz.");
      }
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