# BUTEX Debating Club Platform - PRD

## Original Problem Statement
Build a modern, minimal, fully responsive training and management platform for the BUTEX Debating Club. Non-technical admins must be able to manage all dynamic content (leadership, homepage, courses, announcements, etc.) from a frontend admin dashboard.

## Tech Stack
- **Backend:** FastAPI + MongoDB (originally requested Supabase - user hasn't confirmed stack preference)
- **Frontend:** React + Tailwind CSS + Shadcn UI
- **Auth:** Custom JWT implementation
- **Database:** MongoDB via pymongo

## Architecture
```
/app
├── backend/
│   ├── server.py         # Monolithic FastAPI (~1200 lines)
│   ├── .env              # MONGO_URL, DB_NAME
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.js           # Router
    │   ├── lib/api.js       # API client
    │   ├── contexts/        # Auth, Theme
    │   ├── pages/           # Public + Admin pages
    │   └── components/ui/   # Shadcn components
    └── .env                 # REACT_APP_BACKEND_URL
```

## What's Been Implemented
- Full auth system (signup, login, admin/student roles, pending/approved status)
- Public pages: Home, Leadership, Announcements, Courses, Success Events, Alumni, Events, Be a Member
- Admin dashboard with management for all content types
- Dark/Light theme toggle
- Success Stories carousel on homepage
- Homepage hero with large club logo (Feb 27, 2026 - enlarged to match title height)

## Credentials
- Admin: admin@butexdc.edu.bd / admin123

## DB Collections
users, courses, modules, announcements, leadership, success_events, alumni, events, membership

## Pending Issues (Priority Order)
1. (P0) Verify admin panel sidebar navigation links work correctly
2. (P1) Images not displaying on production site (CSP/URL issues)
3. (P1) Deployment errors: PUT /api/admin/leadership/{id} 404, GET /api/user/ 404
4. (P2) Production readiness: JWT secret key, N+1 analytics query

## Upcoming Tasks
- (P1) Student progress tracking (mark modules complete, progress bars)
- (P1) Drag-and-drop reordering for leadership & modules
- (P2) Complete admin user management (last_login, archive)

## Backlog
- (P3) Backend refactoring: split server.py into routes/models/services
- Clarify Supabase vs MongoDB stack preference with user
