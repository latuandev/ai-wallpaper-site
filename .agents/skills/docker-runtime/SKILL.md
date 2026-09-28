---
name: docker-runtime
description: Modify or troubleshoot the local Docker/Docker Compose and Next.js production runtime for the AI Wallpaper Site. Use for container builds, standalone output, ports, environment variables, runtime startup, or localhost:3000 issues.
---

# Docker and runtime workflow

The active app is under `frontend/` and is expected to run at `http://localhost:3000`.

## Preserve the current deployment model

- The Dockerfile is multi-stage.
- Dependencies are installed in the dependency stage.
- Next.js is built in the builder stage.
- The runner uses Next.js standalone output.
- The runtime process should run as the existing non-root user.
- Do not replace standalone output with a full source/node_modules production image unless the task explicitly requires it.

## Dependency changes

When `package.json` changes, update `package-lock.json` with npm and keep the lockfile committed. Do not hand-edit dependency integrity/resolution data.

Prefer `npm ci` in reproducible build paths.

## Environment variables

- Never place secrets in committed files.
- Document newly required values in `frontend/.env.example` with safe placeholders.
- Keep container-internal application port behavior consistent with port `3000` unless the task explicitly changes it.

## Verification

Use the narrowest applicable checks:

```bash
cd frontend
npm ci
npm run build
```

For container-specific changes, when Docker is available:

```bash
cd frontend
docker compose build
docker compose up -d
curl -f http://localhost:3000/
docker compose down
```

If Docker or network access is unavailable, do not claim the container was tested. Report which command could not be executed.
