🎓 Mezun Takip Sistemi - Veritabanı Mimarisi
Bu proje PostgreSQL üzerinde çalışır ve Prisma ORM ile yönetilir. Aşağıdaki şema, sistemdeki tabloların (User, Profile, Post vb.) birbiriyle nasıl konuştuğunu gösterir.

🗺️ İlişki Diyagramı (ER Diagram)

erDiagram
%% İLİŞKİLER (Kimin eli kimin cebinde)
User ||--o| Profile : "Kullanıcının vitrini (Tekil - Opsiyonel)"
User ||--o{ Post : "Paylaştığı gönderiler"
User ||--o{ Comment : "Yaptığı yorumlar"
User ||--o{ Like : "Beğenileri"
User ||--o{ Follows : "Takip ettikleri"
User ||--o{ Follows : "Takipçileri"

    Post ||--o{ Comment : "Gönderiye gelen yorumlar"
    Post ||--o{ Like : "Gönderiye gelen beğeniler"

    Profile ||--o{ Experience : "İş deneyimleri"
    Profile ||--o{ Education : "Eğitim geçmişi"
    Profile }o--o{ Skill : "Yetenekleri (Çoka-Çok)"

    %% TABLO DETAYLARI
    User {
        String id PK
        String email UK
        String password "Hashli"
        Role role "SUPER_ADMIN, ADMIN, ACADEMIC, GRADUATE"
        Boolean isEmailVerified "1. Aşama: E-posta Onayı"
        Boolean isAdminApproved "2. Aşama: Yönetici Onayı"
        String verificationCode "Onay Kodu"
        DateTime createdAt
    }

    Profile {
        String id PK
        String userId FK "Hangi Kullanıcı?"
        String firstName
        String lastName
        String bio "Biyografi"
        String location "Konum"
        String academicTitle "Sadece Hocalarda (Prof. Dr.)"
        Int graduationYear "Sadece Mezunlarda"
        String linkedin "Sosyal Medya"
        String github "Sosyal Medya"
        String website "Kişisel Site"
    }

    Post {
        String id PK
        String authorId FK "Yazar"
        String content "İçerik"
        String imageUrl "Resim (Opsiyonel)"
        DateTime createdAt
    }

    Comment {
        String id PK
        String content "Yorum"
        String postId FK "Hangi Post?"
        String authorId FK "Kim Yazdı?"
        DateTime createdAt
    }

    Like {
        String id PK
        String postId FK "Beğenilen Post"
        String userId FK "Beğenen Kişi"
        DateTime createdAt
    }

    Follows {
        String followerId FK "Takip Eden"
        String followingId FK "Takip Edilen"
        DateTime createdAt
    }

    Experience {
        String id PK
        String profileId FK
        String title "Pozisyon"
        String company "Şirket"
        String location "Konum"
        DateTime startDate
        DateTime endDate
    }

    Education {
        String id PK
        String profileId FK
        String school "Okul"
        String degree "Derece (Lisans)"
        String field "Bölüm"
        DateTime startDate
        DateTime endDate
    }

    Skill {
        String id PK
        String name UK "Yetenek Adı"
    }
