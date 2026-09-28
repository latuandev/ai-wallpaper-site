# AI Wallpaper Site Frontend

Next.js frontend for the wallpaper discovery and AI wallpaper generation experience.

## Run with Docker

```bash
docker compose up --build
```

Open http://localhost:3000.

## Routes

- `/` — responsive wallpaper discovery homepage
- `/generate` — UI entry point for the future AI wallpaper generator

## Notes

- Wallpaper data is currently mock data in `data/wallpapers.ts`.
- Remote demo images are loaded from Unsplash through `next/image`.
- Next.js standalone output is enabled for a smaller production Docker image.
- `.env` is intentionally not committed; copy `.env.example` when local environment variables are needed.
