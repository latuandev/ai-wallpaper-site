# AGENTS.md

## Repository scope

This repository contains two application areas with separate implementation conventions:

- `frontend/` — Next.js / React / TypeScript frontend.
- `backend/` — Django / Django REST Framework / PostgreSQL backend.

## Task routing

Before changing code, identify which application area owns the task.

### Frontend tasks

For work under `frontend/`, read and follow:

```text
frontend/AGENTS.md
```

Frontend-specific instructions take precedence for files under `frontend/`.

Relevant frontend skills live under:

```text
.agents/skills/frontend/
```

### Backend tasks

For work under `backend/`, read and follow:

```text
backend/AGENTS.md
```

Backend-specific instructions take precedence for files under `backend/`.

Relevant backend skills live under:

```text
.agents/skills/backend/
```

### Cross-stack tasks

When a task explicitly changes both frontend and backend:

1. Read both scoped `AGENTS.md` files.
2. Preserve each side's conventions within its own directory.
3. Keep the API contract explicit between the two sides.
4. Do not refactor unrelated code in either application area.

## Repository-wide principles

- Implement only the requested scope.
- Prefer small, reviewable diffs over broad refactors.
- Reuse existing conventions before introducing new abstractions or dependencies.
- Do not rewrite or reformat unrelated files solely for style consistency.
- Never commit secrets. Document required environment variables with safe placeholders in the appropriate `.env.example`.
- If an applicable check cannot be executed, report that limitation explicitly instead of claiming it passed.
