# FairLens

An enterprise-grade bias detection and explainability platform. FairLens mathematically audits datasets for discrimination—mapping directly to the EEOC Uniform Guidelines—and translates complex statistical disparities into actionable UI.

Built for the ATLAS Hackathon.

## The Architecture

FairLens operates on a decoupled monorepo architecture built for heavy computation and zero-lag rendering.

*   **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion.
*   **Math Engine**: FastAPI, IBM AIF360, Pandas, Scikit-Learn.
*   **Authentication & State**: Supabase (RLS protected), Zustand.
*   **Data Viz**: Recharts.

## Core Mechanics

1.  **Ephemeral Processing**: Drag and drop any raw applicant or HR CSV. The FastAPI engine processes the dataset entirely in memory (Zero Data Retention) to comply with stringent data privacy standards.
2.  **Deterministic Math**: Before models touch the data, we run strict, deterministic calculations (Disparate Impact, Demographic Parity Difference) using the AIF360 library to check for adherence to the 4/5ths rule.
3.  **Real-Time Explainability**: Statistical disparities are streamed via Server-Sent Events (SSE) into plain-English, non-technical executive summaries with actionable mitigation steps.

## Local Development Initialization

### 1. Math Engine (Backend)

The backend handles the AIF360 logic and large dataset encoding.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Boot the engine (runs on port 8000)
uvicorn app.main:app --reload
```

### 2. Client Application (Frontend)

The frontend requires Bun.

```bash
cd frontend
bun install

# Create a .env.local based on .env.example with your Supabase keys
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Boot the client (runs on port 3000)
bun run dev
```

## Vercel Deployment

The frontend is fully optimized for Vercel deployment. 

1. Connect the `frontend` directory in the monorepo to your Vercel project.
2. Set your framework preset to **Next.js**.
3. Add the required Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Keep the default Build Command (`next build`). Vercel handles Turbopack seamlessly.

**Note:** Ensure your FastAPI backend is deployed to an environment that supports persistent ephemeral memory instances (like Render or Railway) and update the `fetch` endpoint in `frontend/src/app/dashboard/page.tsx` before production deployment.

## Security & Compliance
*   **SOC2 Alignment**: All CSV parsing occurs without touching a persistent database volume. 
*   **EEOC Uniform Guidelines**: Built specifically to trigger audits when the Disparate Impact ratio crosses the 0.80 threshold.

---
*Created by Aravind*
