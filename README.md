# InteractHub
InteractHub is a modern, full-stack social media web application built with React, TypeScript, and ASP.NET Core 8.0. It features real-time notifications, secure JWT authentication, and cloud deployment on Microsoft Azure. Developed for the C# and .NET Development course.
# InteractHub - Social Media Web Application

![InteractHub Logo](https://via.placeholder.com/150) ## 📖 Project Overview
[cite_start]InteractHub is a fully functional social media platform built as a Full-Stack Development Assignment for the C# and .NET Development course[cite: 7, 28]. [cite_start]The application allows users to connect, share moments, and interact in real-time[cite: 40, 46]. [cite_start]It strictly follows a Single Page Application (SPA) architecture communicating with a RESTful API[cite: 65, 66].

## ✨ Key Features
* [cite_start]**Authentication:** Secure account creation and login using JWT (JSON Web Tokens) and ASP.NET Core Identity[cite: 41, 72].
* [cite_start]**Post & Feed:** Users can post status updates containing text and images[cite: 42].
* [cite_start]**Stories:** Share temporary content (Stories) with followers[cite: 43].
* [cite_start]**Social Interactions:** Like, comment, and share posts[cite: 44].
* [cite_start]**Connections:** Send and manage friend requests[cite: 45].
* [cite_start]**Real-time Notifications:** Receive instant updates via SignalR[cite: 46, 76].
* [cite_start]**Trends & Discovery:** Track trending hashtags[cite: 48].
* [cite_start]**Moderation:** Admin capabilities to report and manage inappropriate content[cite: 49].

## 🛠️ Technology Stack
### [cite_start]Frontend [cite: 55]
* [cite_start]**Framework:** React 18+ [cite: 56]
* [cite_start]**Language:** TypeScript (Strict Mode) [cite: 57]
* [cite_start]**Styling:** Tailwind CSS [cite: 58]
* [cite_start]**Routing:** React Router v6+ [cite: 61]
* [cite_start]**State Management:** React Context API / Redux Toolkit [cite: 60]
* [cite_start]**HTTP Client:** Axios [cite: 62]

### [cite_start]Backend [cite: 67]
* [cite_start]**Framework:** ASP.NET Core 8.0+ Web API [cite: 68]
* [cite_start]**Database:** SQL Server with Entity Framework Core 8.0+ [cite: 70, 71]
* [cite_start]**Architecture:** RESTful API, Repository & Service Patterns [cite: 69]
* [cite_start]**Real-time:** SignalR [cite: 76]
* [cite_start]**Documentation:** Swagger / OpenAPI [cite: 74]

### [cite_start]Cloud & DevOps [cite: 77]
* [cite_start]**Platform:** Microsoft Azure (App Service, SQL Database) [cite: 78, 337, 338]
* [cite_start]**Storage:** Azure Blob Storage for media files [cite: 80]
* [cite_start]**CI/CD:** Azure DevOps / GitHub Actions [cite: 79]

## 🚀 Setup and Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
* [cite_start][SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) & SSMS / Azure Data Studio [cite: 418, 420]
* [cite_start][Visual Studio 2022](https://visualstudio.microsoft.com/) or VS Code [cite: 417]

### 1. Database Setup
1. Open the backend solution in Visual Studio 2022.
2. Update the `DefaultConnection` string in `appsettings.json` to point to your local SQL Server instance.
3. Open the Package Manager Console and run:
   ```bash
   Update-Database
(This will create the database and seed the initial data)
### 2. Backend (API) Setup
1. Navigate to the backend project directory.
2. Run the API project using Visual Studio (press F5) or via CLI by running the command: `dotnet run`
3. The API documentation will be available at `https://localhost:<port>/swagger`
### 3. Frontend Setup
1. Navigate to the frontend client directory.
2. Install dependencies by running the command: `npm install`
3. Create a `.env` file in the root of your frontend folder and set the backend API URL. Example: `VITE_API_BASE_URL=https://localhost:<port>/api`
4. Start the development server by running: `npm run dev`

## 📚 API Documentation
Detailed API documentation and endpoint specifications can be explored interactively via Swagger UI once the backend server is running locally at the `/swagger` endpoint.

## 👥 Team Members
* [Tên Thành viên 1] - Frontend Developer
* [Tên Thành viên 2] - Backend Developer
* [Tên Thành viên 3] - Database & API
* [Tên Thành viên 4] - Testing & QA
* [Tên Thành viên 5] - Cloud Deployment & DevOps

---
*Note: This project strictly adheres to the academic integrity guidelines provided by the course instructors. All complex logic is properly commented, and third-party tools/libraries are cited appropriately.*
