import { v2 as cloudinary } from "cloudinary";

// Cloudinary Ayarları (.env dosyasından otomatik çekilir)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Herhangi bir resmi Cloudinary'e yüklemek için kullanacağımız ortak ve temiz fonksiyon
export async function uploadImageToCloudinary(file) {
  // Gelen dosyayı buffer'a çeviriyoruz
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Promise yapısı ile yükleme işleminin bitmesini ve bize bir URL dönmesini bekliyoruz
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ktun-mezun-takip" }, // Cloudinary'de açılacak klasör adı
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}