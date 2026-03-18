
export const getRegistrationEmailTemplate = (firstName, lastName, verificationCode) => `
  <h3>Hoş Geldiniz, ${firstName} ${lastName}</h3>
  <p>Kaydınızı tamamlamak için e-posta adresinizi doğrulamanız gerekmektedir.</p>
  <p>Doğrulama kodunuz:</p>
  <h1 style="color: #2563EB; letter-spacing: 5px;">${verificationCode}</h1>
  <p><strong>Bilgilendirme:</strong> E-postanızı doğruladıktan sonra hesabınız yönetici onayına düşecektir.</p>
`;

export const getResendCodeEmailTemplate = (verificationCode) => `
  <h3>Doğrulama Kodunuz Yenilendi</h3>
  <p>İsteğiniz üzerine yeni bir doğrulama kodu oluşturuldu:</p>
  <h1 style="color: #2563EB; letter-spacing: 5px;">${verificationCode}</h1>
  <p>Bu kod 3 dakika süreyle geçerlidir.</p>
`;

export const getUserApprovedEmailTemplate = (fullName, appUrl) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #9d182e;">Tebrikler, ${fullName}!</h2>
    <p>Mezun Takip Sistemi hesabınız yönetici tarafından başarıyla onaylanmıştır.</p>
    <p>Artık platforma giriş yapabilir, mezun ağına katılabilir ve tüm özelliklerden faydalanabilirsiniz.</p>
    <br>
    <p><a href="${appUrl}" style="background-color: #9d182e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sisteme Giriş Yap</a></p>
    <br>
    <p>İyi günler dileriz.</p>
  </div>
`;

export const getUserDeletedEmailTemplate = (targetName, deleteReason, adminName, adminEmail) => `
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
`;