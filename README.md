<<<<<<< HEAD
# Resume Screening & Candidate Ranking Web Application

AI-powered full-stack web app that automatically screens resumes against a Job Description and ranks candidates by match score.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| AI | OpenAI GPT-4o-mini |
| Deployment | Render (backend) + Vercel (frontend) |

---

## Architecture Overview

```
┌─────────────────┐        ┌──────────────────────┐        ┌──────────────┐
│  React Frontend │  HTTP  │  Express Backend      │  SQL   │  PostgreSQL  │
│  (Vite)         │ ──────▶│  /api/jobs            │ ──────▶│  Database    │
│  Port 5173      │        │  Port 5000            │        │              │
└─────────────────┘        └──────────┬───────────┘        └──────────────┘
                                       │ OpenAI API
                                       ▼
                              ┌─────────────────┐
                              │  GPT-4o-mini    │
                              │  Resume Scoring │
                              └─────────────────┘
```

### How Scoring Works

Each resume is parsed to plain text (PDF/DOC/DOCX) and sent to GPT-4o-mini along with the Job Description. The AI scores each candidate 0–100 based on:

- **Skills match** — 40%
- **Experience relevance** — 30%
- **Education alignment** — 20%
- **Keyword similarity** — 10%

Results are stored in PostgreSQL and returned ranked from highest to lowest.

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (running locally or on a cloud service like Supabase/Neon)
- OpenAI API key

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd resume-screener
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
OPENAI_API_KEY=sk-...your-key-here...
DATABASE_URL=postgresql://username:password@localhost:5432/resume_screener
FRONTEND_URL=http://localhost:5173
```

Create the database:
```bash
psql -U postgres -c "CREATE DATABASE resume_screener;"
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

Start frontend:
```bash
npm run dev
```

Open `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Upload resumes + JD, run analysis |
| GET | `/api/jobs` | List all past screenings |
| GET | `/api/jobs/:id/candidates` | Get ranked candidates for a job |
| DELETE | `/api/jobs/:id` | Delete a screening |
| GET | `/health` | Health check |

### POST `/api/jobs` — multipart/form-data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| resumes | File[] | ✅ | Resume files (PDF/DOC/DOCX/TXT) |
| jobDescription | string | ✅* | JD text (or upload jdFile) |
| jdFile | File | ✅* | JD document upload |
| jobTitle | string | ❌ | Optional job title |

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set root directory to `backend/`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (use Render PostgreSQL or Neon)
   - `FRONTEND_URL` (your Vercel URL)
   - `NODE_ENV=production`

### Frontend → Vercel

1. Create new project on [vercel.com](https://vercel.com)
2. Set root directory to `frontend/`
3. Add environment variable:
   - `VITE_API_URL=https://your-render-backend.onrender.com/api`
4. Deploy

---

## Assumptions

- Resumes must contain readable text (scanned image PDFs without OCR may not parse well)
- OpenAI API key must have access to `gpt-4o-mini` model
- PostgreSQL must have the `gen_random_uuid()` function (available in PG 13+)
- Each resume file is capped at 5MB
=======
# Resume-Screener_Project
>>>>>>> 5528871c7168ccc43bb2537af339b5eb4224ed02
