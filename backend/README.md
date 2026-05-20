# Backend (Express + TypeScript)

## Setup
1. Install deps:
   - `npm install`
2. Create your env file:
   - copy `.env.example` to `.env`

## Prisma (Database)
- Generate client:
  - `npm run prisma:generate`
- Run migrations (dev):
  - `npm run prisma:migrate`
- Prisma Studio:
  - `npm run prisma:studio`

## Run (dev)
- `npm run dev`

## Test
- Open: `http://localhost:4000/health`
  - Auth:
    - `POST /auth/student/register`
    - `POST /auth/student/login`
    - `POST /auth/lecturer/register`
    - `POST /auth/lecturer/login`
    - `GET /auth/me` (Bearer token)
