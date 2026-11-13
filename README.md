# CodeArena — AI-powered coding practice platform

A full-stack MERN coding platform starter with an interactive workspace, Judge0 execution, Gemini AI assistance, editorial/video support, profiles, activity heatmaps and learning analytics.

## Stack
- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, Monaco Editor, Recharts, React Router
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, HTTP-only cookies, optional Redis
- Integrations: Judge0 for isolated code execution; Google Gemini for AI help

## Requirements
Node.js 20+, MongoDB connection string, optional Redis, Judge0 API credentials and Gemini API key.

## Run locally
```bash
# from project root
npm install
npm run install:all
cp backend/.env.example backend/.env
# Fill in backend/.env
npm run dev
```
Frontend: http://localhost:5173  
API health: http://localhost:5000/api/health

## Environment
See `backend/.env.example`. Never put secrets in frontend environment variables.

## Deployment
1. Create a MongoDB Atlas database and (optionally) Redis instance.
2. Deploy `backend/` as a Node web service (Render/Railway). Set all backend environment variables and `CLIENT_URL` to your deployed frontend URL.
3. Deploy `frontend/` to Vercel. Set `VITE_API_URL` to your backend API URL (for example `https://your-api.onrender.com/api`).
4. Enable credentials in CORS and configure HTTPS. The backend cookie uses `sameSite=None; secure=true` in production.
5. Configure Judge0 and Gemini credentials on the backend only.

## Important implementation notes
- Code execution is delegated to Judge0; never execute arbitrary user code directly in your Express process.
- Redis is optional for local development. If absent, logout revocation falls back to a short-lived in-memory denylist (not suitable for multi-instance production).
- Analytics are calculated from persisted submissions. Seed data is provided for the problem catalogue; real account analytics appear after users submit solutions.
- Video editorial URLs are stored per problem and rendered when supplied by an admin.
- Admin endpoints require `role: "admin"`; promote the first admin manually in MongoDB.
- Add rate limiting, monitoring, backups, and a production Judge0 plan before public launch.

## API overview
- `POST /api/auth/register`, `/login`, `/logout`, `GET /api/auth/me`
- `GET /api/problems`, `GET /api/problems/:slug`
- `POST /api/submissions/run`, `POST /api/submissions/submit`, `GET /api/submissions/me`
- `POST /api/ai/assist`
- `GET /api/analytics/me`, `GET /api/users/:username`
- Admin: `POST /api/problems`, `PATCH /api/problems/:id`, `DELETE /api/problems/:id`

## Project structure
```
CodeArena/
  backend/
    src/{config,controllers,middleware,models,routes,services,utils}
  frontend/
    src/{components,pages,store,utils}
```

## Expanded learning experience

The frontend now includes:
- Topic browser generated from problem tags, with per-topic and Easy/Medium/Hard filters.
- In-app contest listing and contest detail routes (`/contests` and `/contests/:slug`).
- Profile analytics for difficulty distribution, consistency heatmap, topic strengths/weaknesses, improvement priorities, and recent accepted problems.
- Weekly activity chart derived from the user's submission activity rather than hard-coded demo values.
- Existing Monaco coding workspace with Run/Submit actions, editorial/video tabs, and Gemini assistant UI.

## Important implementation notes
- Contest entries are starter/demo contest definitions. A production contest system still needs persistent registration, server-authoritative start/end times, contest-specific problem sets, leaderboard/rating calculations, and anti-cheat/rate-limit controls.
- Topic analytics and recent solved problems are calculated from authenticated, persisted submissions. They remain empty until a user submits solutions.
- The displayed rank is currently a progress estimate, not a verified global leaderboard rank.
- Judge0 execution requires a valid Judge0 endpoint/API key and problem test cases. Confirm the input/output contract and provide complete executable submissions for each language before using this as a public judge.
- Video editorials appear only when a valid video URL is configured on the problem record.
