# Backend

## Docker Compose

Copy the example environment file and replace the development values as needed:

```bash
cp .env.example .env
docker compose up --build
```

The backend is available at <http://localhost:8000>, and Django admin is at
<http://localhost:8000/admin/>.

The API container applies database migrations before starting Gunicorn.

Demo seed source images must be supplied manually under
`apps/wallpapers/data/images/` before running `python manage.py seed_wallpapers`.
This directory is gitignored, and filenames must match the `image_filename`
values in `apps/wallpapers/data/seed_data.py`. Filenames must use lowercase
kebab-case; their stems determine the seeded titles, for example
`fly-bird.png` becomes `Fly Bird`. Invalid filenames are rejected rather than
renamed. The command copies these source files into Django media storage,
served under `/media/` for local development; the seed source directory itself
is not served as runtime media.

Docker Compose bind-mounts `apps/wallpapers/data/images/` read-only into the API
container, so adding or replacing seed source images does not require rebuilding
the API image.

The `apps/wallpapers/data/images/` directory should remain present in Git by
tracking an empty `.gitkeep` file while ignoring all actual seed image files.
This ensures that a fresh clone already contains the bind-mount source directory
with normal developer ownership before Docker Compose starts.

Recommended `.gitignore` rules:

```gitignore
apps/wallpapers/data/images/*
!apps/wallpapers/data/images/.gitkeep
```

The directory should therefore contain:

```text
apps/wallpapers/data/images/
├── .gitkeep
├── cinematic-mountains.jpg
├── sunset-peaks.jpg
└── ...
```

Only `.gitkeep` is committed. Actual seed image files remain local and must not
be committed to Git.

## Management commands

Run Django commands inside the API container:

```bash
docker compose exec api python manage.py check
docker compose exec api python manage.py test
docker compose exec api python manage.py seed_wallpapers
docker compose exec api python manage.py createsuperuser
```
