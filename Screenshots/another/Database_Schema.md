# Database Schema

This document provides the entity relationship model for the InteractHub backend.

## ER Diagram

```mermaid
erDiagram
    ApplicationUser {
        string Id PK
        string UserName
        string Email
        string FullName
        string Bio
        string ProfilePictureUrl
        datetime CreatedAt
    }

    Post {
        int Id PK
        string Content
        string ImageUrl
        datetime CreatedAt
        string UserId FK
    }

    Comment {
        int Id PK
        string Content
        datetime CreatedAt
        string UserId FK
        int PostId FK
    }

    Like {
        int Id PK
        string UserId FK
        int PostId FK
        int CommentId FK
        datetime CreatedAt
    }

    Connection {
        string FollowerId PK, FK
        string FolloweeId PK, FK
        datetime CreatedAt
    }

    Story {
        int Id PK
        string ImageUrl
        string TextContent
        datetime CreatedAt
        datetime ExpiresAt
        string UserId FK
    }

    Notification {
        int Id PK
        string Content
        string Type
        int RelatedEntityId
        bool IsRead
        datetime CreatedAt
        string UserId FK
    }

    Hashtag {
        int Id PK
        string Name
    }

    PostReport {
        int Id PK
        string Reason
        datetime CreatedAt
        string ReporterId FK
        int PostId FK
    }

    ApplicationUser ||--o{ Post : creates
    ApplicationUser ||--o{ Comment : writes
    Post ||--o{ Comment : has

    ApplicationUser ||--o{ Like : creates
    Post ||--o{ Like : receives
    Comment ||--o{ Like : receives

    ApplicationUser ||--o{ Connection : follower
    ApplicationUser ||--o{ Connection : followee

    ApplicationUser ||--o{ Story : publishes
    ApplicationUser ||--o{ Notification : receives

    ApplicationUser ||--o{ PostReport : submits
    Post ||--o{ PostReport : reported_in

    Post }o--o{ Hashtag : tagged_with
```

## SQL Script Generation (EF Core CLI)

Run the following command from the Backend folder to generate the SQL script for graders:

```bash
dotnet ef migrations script -o database_script.sql
```

Output file:

- `database_script.sql` in the current working directory.
