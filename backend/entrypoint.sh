#!/bin/sh
set -eu

python manage.py migrate
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --worker-class gthread \
    --workers 2 \
    --threads 4 \
    --timeout 30
