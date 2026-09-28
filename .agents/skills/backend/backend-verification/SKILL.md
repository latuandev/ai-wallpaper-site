---
name: backend-verification
description: Verify Python, Django, DRF, PostgreSQL, migrations, Gunicorn, and Docker changes for the AI Wallpaper Site backend without expanding task scope.
---

# Backend verification workflow

Follow `backend/AGENTS.md` and validate only the surfaces affected by the task.

## Python and Django checks

When tooling is configured, run:

```bash
cd backend
python -m compileall apps common config
ruff check .
ruff format --check .
python manage.py check
python manage.py makemigrations --check
python manage.py test
```

If the project does not yet have Ruff configured, do not add Ruff solely to verify an unrelated feature unless the task includes backend tooling/bootstrap. Report that those checks were unavailable.

## Migration review

For model changes:

- Confirm the expected migration was generated.
- Inspect the migration for accidental schema churn.
- Run `python manage.py makemigrations --check` after generation.
- Run relevant tests against PostgreSQL when the local environment supports it.

## API checks

For DRF changes, verify the affected behavior, such as:

- List response.
- Detail lookup.
- Validation errors.
- Filtering.
- Search.
- Ordering.
- Pagination.
- Permissions when applicable.

Use Django/DRF tests instead of manual HTTP-only checking when a test can express the behavior reliably.

## Docker/runtime checks

When Docker is available and runtime behavior changed:

```bash
cd backend
docker compose config
docker compose build
docker compose up -d
```

Then verify the affected API endpoint on the configured backend port, normally `http://localhost:8000`.

Do not claim Docker, PostgreSQL, or Gunicorn was tested if the environment did not support running it.

## Diff review

Before finishing:

- Confirm only requested files/behavior changed.
- Check that no secret or local-only value was committed.
- Check `.env.example` when environment variables changed.
- Check migrations for unintended operations.
- Check user-facing API errors do not expose implementation details.
- Check wallpaper source metadata was not altered for presentation reasons.

## Report accurately

State exactly which commands passed and which could not be run, including the reason for any unverified boundary.
