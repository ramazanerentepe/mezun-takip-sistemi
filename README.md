# Mezun Takip Sistemi

Mezun Takip Sistemi, üniversite mezunlarının birbirleriyle iletişimde kalmasını, iş ağlarını genişletmesini ve kariyer fırsatlarını takip etmesini sağlayan, LinkedIn mantığında geliştirilmiş kapsamlı bir sosyal medya platformudur.

## 🚀 Proje Hakkında

Bu platform, mezunların kariyer yolculuklarında birbirlerine destek olmalarını ve kurumla bağlarını koparmamalarını sağlar. Kullanıcılar profesyonel profillerini oluşturabilir, sektörel paylaşımlar yapabilir ve diğer mezunlarla etkileşime geçebilir.

### Temel Özellikler

- **Gelişmiş Kimlik Doğrulama:** Güvenli giriş, kayıt ve şifre yönetim işlemleri.
- **İnteraktif Akış (Feed):** Mezunların gönderilerini paylaştığı, beğeni ve yorum yapabildiği dinamik ana sayfa.
- **Profesyonel Profil:** İş deneyimi, eğitim bilgileri ve yeteneklerin sergilendiği detaylı kullanıcı profilleri.
- **Yönetici Paneli (Admin Dashboard):** Kullanıcı yönetimi, içerik denetimi ve sistem istatistiklerinin takibi için özel panel.
- **Mezun Ağı:** Dönem arkadaşları ve sektördeki diğer mezunlarla bağlantı kurma imkanı.

## 🛠️ Teknoloji Yığını

Proje, performans ve ölçeklenebilirlik odaklı modern teknolojiler kullanılarak geliştirilmiştir:

- **Frontend & Framework:** [Next.js](https://nextjs.org) (App Router), React
- **Veritabanı:** PostgreSQL
- **ORM:** Prisma
- **Konteynerizasyon:** Docker
- **Stil:** Tailwind CSS

## 📦 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu klonlayın:**

    ```bash
    git clone [https://github.com/kullaniciadi/mezun-takip-sistemi.git](https://github.com/kullaniciadi/mezun-takip-sistemi.git)
    cd mezun-takip-sistemi
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    # veya
    yarn install
    ```

3.  **Çevresel Değişkenleri Ayarlayın:**
    `.env.example` dosyasındaki şablonu kullanarak kendi `.env` dosyanızı oluşturun ve veritabanı bağlantılarını yapılandırın.

4.  **Veritabanını Hazırlayın:**

    ```bash
    npx prisma migrate dev
    ```

5.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

## 📂 Proje Yapısı

- `src/app/(auth)`: Kimlik doğrulama modülleri.
- `src/app/(admin)`: Yönetim paneli arayüzleri.
- `src/app/(portal)`: Kullanıcı akışı ve sosyal özellikler.
