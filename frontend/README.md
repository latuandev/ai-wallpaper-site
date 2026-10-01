# AI Wallpaper Site Frontend

Next.js frontend for the wallpaper discovery and AI wallpaper generation experience.

## Run with Docker

```bash
cd ../backend
docker compose up -d --build
docker compose exec api python manage.py seed_wallpapers

cd ../frontend
cp .env.example .env
docker compose up -d --build
```

Open http://localhost:3000.

Start the backend first because it creates the shared Docker network used by the
frontend to reach the API service at `http://api:8000`.

## Routes

- `/` — responsive wallpaper discovery homepage
- `/generate` — UI entry point for the future AI wallpaper generator

## Notes

- Homepage wallpaper records are loaded server-side from the backend API.
- `data/wallpapers.ts` retains only wallpaper types and section presentation metadata.
- Browser-visible media is loaded from the configured backend media origin.
- Next.js standalone output is enabled for a smaller production Docker image.
- `.env` is intentionally not committed; copy `.env.example` when local environment variables are needed.
