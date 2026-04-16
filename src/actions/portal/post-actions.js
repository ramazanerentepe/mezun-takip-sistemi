"use server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createPost(formData) {
  const content = formData.get("content");
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);

  if (!session?.userId || !content) return { error: "Yetkisiz işlem veya boş içerik." };

  try {
    await prisma.post.create({
      data: { content, authorId: session.userId }
    });
    revalidatePath("/feed"); // Sayfayı anında güncelle
    return { success: true };
  } catch (e) {
    return { error: "Veritabanı hatası." };
  }
}