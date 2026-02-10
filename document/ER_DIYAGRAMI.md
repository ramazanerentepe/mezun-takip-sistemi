erDiagram
%% KULLANICI VE PROFİL
User {
String id PK
String email UK
String password
Role role "ENUM: SUPER_ADMIN, ADMIN, ACADEMIC, GRADUATE"
Boolean isEmailVerified
String verificationCode
DateTime verificationCodeExpiry
Boolean isAdminApproved
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

    %% İÇERİK MODELLERİ
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
        DateTime createdAt
        String postId FK
        String authorId FK
    }

    Like {
        String id PK
        DateTime createdAt
        String postId FK
        String userId FK
    }

    %% İLİŞKİ TABLOLARI
    Follows {
        String followerId FK "Takip Eden"
        String followingId FK "Takip Edilen"
        DateTime createdAt
    }

    %% PROFİL DETAYLARI
    Experience {
        String id PK
        String profileId FK
        String title
        String company
        String location
        DateTime startDate
        DateTime endDate
        String description
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

    %% İLİŞKİLER (RELATIONS)
    User ||--o| Profile : "1-1 (Opsiyonel)"
    User ||--o{ Post : "yazar"
    User ||--o{ Comment : "yorumlar"
    User ||--o{ Like : "beğenir"
    User ||--o{ Follows : "takip eder/edilir"

    Profile ||--o{ Experience : "deneyimleri"
    Profile ||--o{ Education : "eğitimleri"
    Profile }o--o{ Skill : "yetenekleri (M-N)"

    Post ||--o{ Comment : "içerir"
    Post ||--o{ Like : "içerir"
