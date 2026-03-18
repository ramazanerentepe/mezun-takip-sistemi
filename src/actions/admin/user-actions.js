"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Her işlemden önce admin yetkisi kontrolü yapacak yardımcı fonksiyon
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    throw new Error("Bu işlemi yapmak için yetkiniz yok.");
  }
  return session;
}

// 1. Kullanıcıyı Onayla
export async function approveUser(userId) {
  try {
    await checkAdminAuth();
    await prisma.user.update({
      where: { id: userId },
      data: { isAdminApproved: true },
    });
    
    revalidatePath("/users"); // Tabloyu otomatik yenile
    return { success: true };
  } catch (error) {
    return { error: error.message || "Kullanıcı onaylanırken hata oluştu." };
  }
}

// 2. Kullanıcıyı Sil
export async function deleteUser(userId) {
  try {
    await checkAdminAuth();
    await prisma.user.delete({
      where: { id: userId },
    });
    
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { error: error.message || "Kullanıcı silinirken hata oluştu." };
  }
}

// 3. Kullanıcı Yetkisini Güncelle
export async function updateUserRole(userId, newRole) {
  try {
    const adminSession = await checkAdminAuth();
    
    // Normal ADMIN, başka birini SUPER_ADMIN yapamasın
    if (adminSession.role !== "SUPER_ADMIN" && newRole === "SUPER_ADMIN") {
      throw new Error("Super Admin yetkisi verme hakkınız yok.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { error: error.message || "Yetki güncellenirken hata oluştu." };
  }
}