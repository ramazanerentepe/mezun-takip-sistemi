import nodemailer from "nodemailer";

// 1. Postacı Ayarları (Gmail ile bağlantı)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,    // .env dosyasından
    pass: process.env.SMTP_PASSWORD, // .env dosyasından
  },
});

// 2. Mail Gönderme Fonksiyonu (Dışarıya açıyoruz)
export async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Mezun Takip Sistemi" <${process.env.SMTP_EMAIL}>`, // Gönderen adı
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Mail gönderildi: %s", info.messageId);
    return { success: true };

  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return { success: false, error: error.message };
  }
}