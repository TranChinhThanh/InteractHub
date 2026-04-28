# Frontend Component Hierarchy

This document describes the current React component hierarchy for InteractHub.

## Runtime Tree

```text
src/main.tsx
└── StrictMode
    └── QueryClientProvider
        └── AuthProvider
            └── App (src/App.tsx)
                └── BrowserRouter
                    └── Suspense (fallback: PageLoader)
                        ├── GlobalNotificationListener
                        ├── Toaster
                        └── Routes
                            ├── /login -> LoginPage
                            │   └── TextInput (shared)
                            ├── /register -> RegisterPage
                            │   └── TextInput (shared)
                            └── / -> ProtectedRoute -> MainLayout
                                ├── Navbar
                                ├── LeftSidebar
                                ├── RightSidebar
                                └── Outlet
                                    ├── HomePage
                                    │   ├── StoriesBar
                                    │   ├── CreatePostForm
                                    │   │   └── FileInput (shared)
                                    │   ├── PostCard (feed list)
                                    │   │   └── CommentSection (toggle)
                                    │   └── PostSkeleton (loading)
                                    ├── ProfilePage
                                    │   ├── PostCard (user posts)
                                    │   │   └── CommentSection (toggle)
                                    │   └── PostSkeleton (loading)
                                    ├── NotificationsPage
                                    ├── SearchPage
                                    └── PostDetailPage
                                        └── PostCard
                                            └── CommentSection
```

## Shared Building Blocks

- Auth context: `AuthProvider` + `useAuth` (session token and user state).
- Data/cache layer: TanStack Query via `QueryClientProvider`.
- Shared inputs: `TextInput`, `FileInput`.
- Shared UI helpers: `PageLoader`, `PostSkeleton`.
- Realtime listener: `GlobalNotificationListener` (SignalR).
- Shared card blocks: `PostCard`, `CommentSection`.
