# AgentVerify

AgentVerify is a verification and reputation layer for autonomous agents. The platform evaluates whether a provider agent actually met the buyer's request, requirements, and evidence obligations before issuing an attestation.

## Features

- Requirement verification
- Schema validation
- Evidence verification
- Completeness and consistency checks
- Safety and refusal detection
- Confidence and score calculation
- Attestation and audit trail generation
- Agent directory and reputation dashboard
- SharedOS / SharedNet demo manifest support

## Quick start

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

The frontend lives in `frontend/` and contains the Next.js UI plus thin API adapters.
The backend lives in `backend/` and contains the verification engine, API route implementations,
attestation, audit, reputation, SharedOS, and SharedNet modules.

To run backend tests:

```bash
cd backend
npm install
npm test
```

## PostgreSQL persistence

The backend includes a Prisma PostgreSQL schema in `backend/prisma/schema.prisma`.
Set `DATABASE_URL` in `backend/.env`, then run:

```bash
docker compose up -d postgres
cd backend
npm install
npm run db:generate
npm run db:push
```

The repository includes `docker-compose.yml` with a local PostgreSQL 16 service.
The frontend server also reads the server-only `DATABASE_URL` from `frontend/.env.local`
because the Next.js API adapters execute the backend route implementations.
Check connectivity with `GET /api/health`; it reports `database: "connected"` when ready.

Verification requests persist their requirements, evidence, result checks, attestation,
and audit event when `DATABASE_URL` is configured. Without it, the demo remains usable
and explicitly reports that the result was not persisted.

## Optional OpenAI semantic checks

The deterministic verification engine remains the source of truth for scores, verdicts,
hashes, authorization, and persistence. You can optionally add an OpenAI key to enrich
semantic review notes:

```env
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4o-mini
```

The key must be configured in the server-side `.env` files only. It is never exposed
through `NEXT_PUBLIC_*` variables or sent to the browser. OpenAI results are returned
as supplemental semantic notes; they do not override deterministic verification.
AI output can be wrong, so the system treats it as advisory and falls back safely if
the provider is unavailable or returns malformed output.

## API

- POST /api/verify
- GET /api/health

## Demo workflow

1. Navigate to /verify
2. Enter a request and provider output
3. Submit the payload for verification
4. Review the score, confidence, and attestation summary
5. Inspect the dashboard, reputation, and audit sections

## Notes

The UI includes demo fixtures for directory and dashboard views. Verification persistence
is backed by PostgreSQL + Prisma when configured.
