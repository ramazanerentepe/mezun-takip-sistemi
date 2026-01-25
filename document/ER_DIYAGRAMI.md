# 🎓 Mezun Takip Sistemi - Veritabanı Mimarisi

Bu proje **PostgreSQL** üzerinde çalışır ve **Prisma ORM** ile yönetilir. Aşağıdaki şema, sistemdeki tabloların (User, Department, Post vb.) birbiriyle nasıl konuştuğunu gösterir.

### 🗺️ İlişki Diyagramı (ER Diagram)

```mermaid
erDiagram
    %% İLİŞKİLER (Kimin eli kimin cebinde)
    Department ||--o{ User : "Bölümün öğrencileri/hocaları"
    User ||--|| Profile : "Kullanıcının vitrini (Tekil)"
    User ||--o{ Post : "Paylaştığı gönderiler"
    User ||--o{ Comment : "Yaptığı yorumlar"
    User ||--o{ Like : "Beğenileri"
    User ||--o{ Follows : "Takip ettikleri"
    User ||--o{ Follows : "Takipçileri"

    Post ||--o{ Comment : "Gönderiye gelen yorumlar"
    Post ||--o{ Like : "Gönderiye gelen beğeniler"

    Profile ||--o{ Experience : "İş deneyimleri"
    Profile ||--o{ Education : "Eğitim geçmişi"
    Profile }o--o{ Skill : "Yetenekleri"

    %% TABLO DETAYLARI
    Department {
        String id PK
        String name "Örn: Bilgisayar Müh."
    }

    User {
        String id PK
        String email
        String password "Hashli"
        Role role "ADMIN, ACADEMIC, GRADUATE"
        Boolean isVerified "Onaylı mı?"
        String verificationCode "Doğrulama Kodu (OTP)"
        DateTime verificationCodeExpiry "Kodun Son Kullanma Tarihi"
        String departmentId FK "Bağlı olduğu bölüm"
    }

    Profile {
        String id PK
        String userId FK
        String firstName
        String lastName
        String diplomaNo "Sadece Mezunlarda"
        String academicTitle "Sadece Hocalarda (Prof. Dr.)"
    }

    Post {
        String id PK
        String content "İçerik"
        String imageUrl "Resim (Opsiyonel)"
        DateTime createdAt
    }

    Follows {
        String followerId FK "Takip Eden"
        String followingId FK "Takip Edilen"
    }
```
