"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

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
    // 1. Gönderiyi (Post) Oluştur
    const newPost = await prisma.post.create({
      data: {
        content: content || "",
        authorId: session.userId,
      }
    });

    const validImages = images.filter(img => img.size > 0);
    
    // 2. Fotoğrafları Fiziksel Olarak Kaydet ve Veritabanına Ekle
    if (validImages.length > 0) {
      // public/uploads klasörünün yolunu belirle
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // Eğer klasör yoksa oluştur
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const imageData = [];

      for (const file of validImages) {
        // Dosyayı Buffer'a çevir (Kaydedilebilir veri formatı)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Boşlukları temizle ve benzersiz bir dosya adı oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, fileName);

        // Dosyayı public/uploads klasörüne yaz (İşte eksik olan parça buydu!)
        await writeFile(filePath, buffer);

        // Veritabanı için eklenecek veriyi hazırla
        imageData.push({
          url: `/uploads/${fileName}`,
          postId: newPost.id
        });
      }

      // 3. Veritabanına (PostImage tablosuna) resim linklerini kaydet
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