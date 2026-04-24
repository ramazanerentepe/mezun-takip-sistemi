"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { uploadImageToCloudinary } from "@/lib/cloudinary"; // YENİ: Kendi yazdığımız modülü içe aktardık

const prisma = new PrismaClient();

export async function createPost(formData) {
  const content = formData.get("content");
  const images = formData.getAll("images");

  if (!content && (!images || images.length === 0 || images[0].size === 0)) {
    return { error: "İçerik veya fotoğraf eklemelisiniz." };
  }

  if (images.length > 5) {
    return { error: "En fazla 5 fotoğraf yükleyebilirsiniz." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const session = sessionCookie ? await decrypt(sessionCookie.value) : null;
  
  if (!session?.userId) return { error: "Oturum hatası." };

  try {
    const newPost = await prisma.post.create({
      data: {
        content: content || "",
        authorId: session.userId,
      }
    });

    const validImages = images.filter(img => img.size > 0);
    
    if (validImages.length > 0) {
      const imageData = [];

      for (const file of validImages) {
        
        // YENİ: Resmi buluta yükle ve sonucunu al
        const uploadResult = await uploadImageToCloudinary(file);

        imageData.push({
          url: uploadResult.secure_url,
          postId: newPost.id
        });
      }

      await prisma.postImage.createMany({
        data: imageData
      });
    }

    revalidatePath("/feed");
    return { success: true };
  } catch (e) {
    console.error("Gönderi paylaşım hatası:", e);
    return { error: "Gönderi oluşturulurken bir hata oluştu." };
  }
}

// Beğeni Fonksiyonu
export async function toggleLike(postId) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const session = sessionCookie ? await decrypt(sessionCookie.value) : null;
  
  if (!session?.userId) return { error: "Oturum hatası. Lütfen giriş yapın." };

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: session.userId,
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      revalidatePath("/feed");
      return { success: true, liked: false };
    } else {
      await prisma.like.create({
        data: {
          postId: postId,
          userId: session.userId,
        }
      });
      revalidatePath("/feed");
      return { success: true, liked: true };
    }
  } catch (e) {
    console.error("Beğeni işlemi başarısız:", e);
    return { error: "Beğeni işlemi sırasında bir hata oluştu." };
  }
}

// Yorum Fonksiyonu
export async function addComment(formData) {
  const content = formData.get("content");
  const postId = formData.get("postId");

  if (!content || content.trim() === "") {
    return { error: "Yorum içeriği boş olamaz." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const session = sessionCookie ? await decrypt(sessionCookie.value) : null;
  
  if (!session?.userId) return { error: "Oturum hatası. Lütfen giriş yapın." };

  try {
    await prisma.comment.create({
      data: {
        content: content,
        postId: postId,
        authorId: session.userId,
      }
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (e) {
    console.error("Yorum ekleme hatası:", e);
    return { error: "Yorum eklenirken bir hata oluştu." };
  }
}