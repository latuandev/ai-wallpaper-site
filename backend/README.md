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
values in `apps/wallpapers/data/seed_data.py`. The command copies these source
files into Django media storage, served under `/media/` for local development;
the seed source directory itself is not served as runtime media.

## Management commands

Run Django commands inside the API container:

```bash
docker compose exec api python manage.py check
docker compose exec api python manage.py test
docker compose exec api python manage.py seed_wallpapers
docker compose exec api python manage.py createsuperuser
```
