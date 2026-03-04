# Habit & Attendance Tracker

A full-stack role-based staff tracker built with **Next.js**, **NextAuth**, **Prisma**, and **SQLite**.

## Features

- Google login + credentials login (only users pre-added by admin are allowed).
- Roles: `ADMIN` and `USER`.
- Admin can:
  - manage monthly habits and assign to all or selected users,
  - create attendance-required dates,
  - view reports/activity logs,
  - configure reminders,
  - send in-app notifications,
  - export habit logs to CSV.
- Users can:
  - see assigned habits,
  - mark daily tick/cross,
  - mark attendance for required dates,
  - receive in-app reminders and admin notifications.
- Real-time feel via auto-refresh polling.

## Setup

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Default credentials from seed:
- Admin: `admin@company.com` / `admin123`
- User: `user@company.com` / `user123`

## API overview

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET|POST /api/admin/habits`
- `GET|POST /api/admin/attendance-dates`
- `GET /api/admin/reports`
- `GET /api/admin/logs`
- `POST /api/admin/reminders`
- `POST /api/admin/notifications`
- `GET /api/admin/export`

### User
- `GET /api/user/dashboard`
- `POST /api/user/habit-log`
- `POST /api/user/attendance`
- `POST /api/user/notifications`
