erDiagram
%% İLİŞKİLER
User ||--|| Profile : "1:1 İlişki"
User ||--o{ Post : "Yazar"
User ||--o{ Comment : "Yorum yapar"
User ||--o{ Like : "Beğenir"
User ||--o{ Follows : "Takipçi (follower)"
User ||--o{ Follows : "Takip edilen (following)"

    Post ||--o{ Comment : "İçerir"
    Post ||--o{ Like : "Alır"

    Profile ||--o{ Experience : "Deneyimler"
    Profile ||--o{ Education : "Eğitimler"
    Profile }o--o{ Skill : "n:m Yetenekler"

    %% TABLO DETAYLARI
    User {
        String id PK
        String email UK
        String password
        Role role "GRADUATE, ACADEMIC, ADMIN, SUPER_ADMIN"
        Boolean isEmailVerified "E-posta Onayı"
        String verificationCode
        DateTime verificationCodeExpiry
        Boolean isAdminApproved "Admin Manuel Onayı"
        DateTime createdAt
    }

    Profile {
        String id PK
        String userId FK
        String firstName
        String lastName
        String bio
        String avatarUrl
        String location
        String academicTitle
        Int graduationYear
        String linkedin
        String github
        String website
    }

    Post {
        String id PK
        String authorId FK
        String content
        String imageUrl
        DateTime createdAt
    }

    Comment {
        String id PK
        String content
        String postId FK
        String authorId FK
        DateTime createdAt
    }

    Like {
        String id PK
        String postId FK
        String userId FK
        DateTime createdAt
    }

    Experience {
        String id PK
        String profileId FK
        String title
        String company
        String location
        DateTime startDate
        DateTime endDate
    }

    Education {
        String id PK
        String profileId FK
        String school
        String degree
        String field
        DateTime startDate
        DateTime endDate
    }

    Skill {
        String id PK
        String name UK
    }

    Follows {
        String followerId PK, FK
        String followingId PK, FK
        DateTime createdAt
    }
