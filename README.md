# InteractHub

## Project Overview

InteractHub is a full-stack social media application built for the C# and .NET course assignment.

The system is implemented as:

- Frontend SPA (React + TypeScript + Vite)
- Backend REST API (ASP.NET Core 8 + EF Core + SQL Server)
- JWT-based authentication and authorization
- Realtime notifications using SignalR

The project includes core social workflows: authentication, posts, comments, likes, follows, stories, notifications, user profile management, search, hashtag trending, and report moderation.

## Tech Stack

### Frontend

- React 19
- TypeScript (strict)
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- TanStack Query
- Axios
- SignalR client

### Backend

- ASP.NET Core Web API (.NET 8)
- Entity Framework Core (SQL Server)
- ASP.NET Core Identity
- JWT Bearer Authentication
- SignalR
- Swagger / OpenAPI

### Testing

- xUnit
- Moq
- Microsoft.AspNetCore.Mvc.Testing (integration tests)

## Setup and Installation

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- SQL Server (LocalDB or SQL Server instance)
- EF Core CLI (`dotnet-ef`)

### Backend Setup

1. Go to backend folder:

```bash
cd Backend
```

2. Restore dependencies:

```bash
dotnet restore
```

3. Update connection string in `Backend/appsettings.json` if needed.

4. Apply migrations to create/update database:

```bash
dotnet ef database update
```

5. Run API:

```bash
dotnet run
```

6. Open Swagger UI:

- `http://localhost:5035/swagger` (or the URL shown in runtime logs)

### Frontend Setup

1. Open a new terminal and go to frontend folder:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start frontend dev server:

```bash
npm run dev
```

4. Important: frontend API base URL is currently configured in `Frontend/src/api/axiosClient.ts` as `http://localhost:5035/api`. If your backend uses another port, update this value.

### Run Tests

```bash
dotnet test Backend/InteractHub.Tests
```

## Implemented Features Summary

### Authentication and Authorization

- User registration and login
- JWT access token flow
- Role-based and policy-based authorization
- Protected frontend routes

### Social Features

- Create/read/delete posts
- Image upload for posts
- Hashtag tagging and trending hashtags
- Post likes (toggle)
- Post comments (create/list/delete)
- Follow/unfollow users and follower/following lists
- Stories (create/list/delete, 24-hour lifecycle)

### Notifications and Realtime

- Notification list
- Mark as read
- Delete single and delete all notifications
- Realtime push via SignalR (`ReceiveNotification`)

### User and Discovery

- User profile view and update
- User search
- Post detail page

### Moderation

- Report post workflow

### API and Architecture Quality

- DTO-based request/response contracts
- Standardized API response envelope
- Controller -> Service -> Repository -> DbContext architecture
- Swagger docs with XML comments

### Testing Coverage

- 15 unit tests across 3 services
- 1 integration test for critical comments workflow
- Total current tests: 16 passing

## Submission Artifacts

- Frontend component hierarchy document: `Frontend/Component_Hierarchy.md`
- Database schema document with Mermaid ERD: `Backend/Database_Schema.md`

## API Endpoints List

### Auth

| Method | Route                     |
| ------ | ------------------------- |
| POST   | `/api/auth/register`      |
| POST   | `/api/auth/login`         |
| GET    | `/api/test/protected`     |
| GET    | `/api/test/user-role`     |
| GET    | `/api/test/self/{userId}` |

### Posts

| Method | Route                      |
| ------ | -------------------------- |
| GET    | `/api/posts`               |
| GET    | `/api/posts/user/{userId}` |
| GET    | `/api/posts/{postId:int}`  |
| POST   | `/api/posts`               |
| POST   | `/api/posts/with-image`    |
| PUT    | `/api/posts/{postId:int}`  |
| DELETE | `/api/posts/{postId:int}`  |

### Users

| Method | Route                         |
| ------ | ----------------------------- |
| GET    | `/api/users/search?q={query}` |
| GET    | `/api/users/{userId}`         |
| PUT    | `/api/users/{userId}`         |

### Friends

| Method | Route                             |
| ------ | --------------------------------- |
| POST   | `/api/friends/{followeeId}`       |
| DELETE | `/api/friends/{followeeId}`       |
| GET    | `/api/friends/{userId}/followers` |
| GET    | `/api/friends/{userId}/following` |

### Stories

| Method | Route                   |
| ------ | ----------------------- |
| POST   | `/api/stories`          |
| GET    | `/api/stories`          |
| DELETE | `/api/stories/{id:int}` |

### Notifications

| Method | Route                              |
| ------ | ---------------------------------- |
| GET    | `/api/notifications`               |
| PUT    | `/api/notifications/{id:int}/read` |
| DELETE | `/api/notifications/{id:int}`      |
| DELETE | `/api/notifications`               |

### Comments

| Method | Route                             |
| ------ | --------------------------------- |
| POST   | `/api/comments/post/{postId:int}` |
| GET    | `/api/comments/post/{postId:int}` |
| DELETE | `/api/comments/{id:int}`          |

### Likes

| Method | Route                                |
| ------ | ------------------------------------ |
| POST   | `/api/likes/post/{postId:int}`       |
| POST   | `/api/likes/comment/{commentId:int}` |

### Reports

| Method | Route                            |
| ------ | -------------------------------- |
| POST   | `/api/reports/post/{postId:int}` |

### Hashtags

| Method | Route                    |
| ------ | ------------------------ |
| GET    | `/api/hashtags/trending` |
