erDiagram
%% --- İLİŞKİLER (RELATIONS) ---
User ||--o| Profile : "Kullanıcının Profili (Opsiyonel)"
User ||--o{ Post : "Paylaştığı Gönderiler"
User ||--o{ Comment : "Yaptığı Yorumlar"
User ||--o{ Like : "Beğenileri"

    %% Takip Sistemi (Many-to-Many / Self Relation)
    User ||--o{ Follows : "Takip Ettikleri"
    User ||--o{ Follows : "Takipçileri"

    %% Gönderi Etkileşimleri
    Post ||--o{ Comment : "Gönderiye Gelen Yorumlar"
    Post ||--o{ Like : "Gönderiye Gelen Beğeniler"

    %% Profil Detayları
    Profile ||--o{ Experience : "İş Deneyimleri"
    Profile ||--o{ Education : "Eğitim Bilgileri"
    Profile }o--o{ Skill : "Yetenekler (Çoka-Çok)"

    %% --- TABLO DETAYLARI (ENTITIES) ---
    User {
        String id PK
        String email UK
        String password "Hashli Şifre"
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
        String academicTitle "Akademisyen Unvanı (Prof. Dr.)"
        Int graduationYear "Mezuniyet Yılı"
        String linkedin "Sosyal Medya"
        String github "Sosyal Medya"
        String website "Kişisel Site"
    }

    Post {
        String id PK
        String authorId FK "Yazar"
        String content "İçerik Metni"
        String imageUrl "Görsel (Opsiyonel)"
        DateTime createdAt
    }

    Comment {
        String id PK
        String content "Yorum Metni"
        String postId FK "Hangi Gönderi?"
        String authorId FK "Kim Yazdı?"
    }

    Like {
        String id PK
        String postId FK "Beğenilen Gönderi"
        String userId FK "Beğenen Kişi"
        Note "Bir kişi bir postu bir kez beğenebilir (Unique)"
    }

    Follows {
        String followerId FK "Takip Eden"
        String followingId FK "Takip Edilen"
        DateTime createdAt
    }

    Experience {
        String id PK
        String profileId FK
        String title "Pozisyon / Unvan"
        String company "Şirket Adı"
        DateTime startDate "Başlangıç"
        DateTime endDate "Bitiş"
    }

    Education {
        String id PK
        String profileId FK
        String school "Okul Adı"
        String degree "Derece (Lisans vb.)"
        String field "Bölüm / Alan"
    }

    Skill {
        String id PK
        String name UK "Yetenek Adı (Java, React vb.)"
    }
