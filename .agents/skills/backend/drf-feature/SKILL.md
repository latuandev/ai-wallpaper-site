---
name: drf-feature
description: Implement or extend Django REST Framework backend features in the AI Wallpaper Site, including domain models, migrations, serializers, services, ModelViewSets, routers, filtering, search, ordering, pagination, permissions, and Django admin integration.
---

# DRF feature workflow

Follow `backend/AGENTS.md` first. Keep changes inside the owning Django domain app unless a repository-wide convention explicitly requires `common/`.

## 1. Find the owning domain

Use or create the smallest appropriate `backend/apps/<domain>/` app.

Default app shape:

```text
apps/<domain>/
├── migrations/
├── services/
├── __init__.py
├── apps.py
├── models.py
├── serializers.py
├── tasks.py
├── tests.py
├── urls.py
└── views.py
```

Do not create extra packages without a concrete responsibility.

## 2. Model the data explicitly

- Use PostgreSQL-compatible Django fields.
- Keep source wallpaper metadata factual.
- Use repository `EnumChoices` for project-defined choices; do not use Django `TextChoices` or `IntegerChoices`.
- Generate migrations for schema changes.
- Add indexes/constraints only when the task or an obvious data invariant justifies them.

## 3. Keep API layers focused

- Models persist data and enforce model-level invariants.
- Serializers validate request data and represent responses.
- Views stay thin.
- Use `ModelViewSet` for standard resource endpoints.
- Use DRF routers.
- Use `django-filter`, `SearchFilter`, and `OrderingFilter` instead of manual query-param parsing where applicable.
- Use pagination for growing list endpoints.

For wallpaper resources, prefer slug lookup when a slug exists.

## 4. Put workflows in services only when there is a workflow

Use `services/` for application orchestration, multi-step state changes, transactions, external infrastructure, and reusable domain workflows.

Do not create a service merely to wrap one trivial ORM call.

Services must not depend on HTTP request/response objects.

## 5. Errors and messages

- Catchable domain errors belong in `apps/<domain>/exceptions.py`.
- End-user API messages belong in `common/messages.py`.
- Never expose internal exception details or implementation internals.

## 6. Query efficiency

Use `select_related` / `prefetch_related` when serializer access would otherwise create an obvious N+1 query. Do not prematurely optimize unrelated queries.

## 7. Tests

Add focused tests for the behavior introduced by the task, including invalid input and important failure paths where relevant.

For API list/detail work, cover the filters/search/ordering/pagination introduced by the task.

## 8. Finish narrowly

Do not modify frontend code during a backend-only task unless explicitly requested.

Use `$backend-verification` before reporting completion.
