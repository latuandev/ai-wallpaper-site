# Backend AGENTS.md

## Scope

- Follow the root `AGENTS.md` for repository-wide routing and principles.
- These backend instructions take precedence for files under `backend/`.
- Do not change frontend code during a backend-only task unless explicitly requested.

These instructions apply to all work under `backend/`.

## Stack

The backend uses:

- Python
- Django
- Django REST Framework
- PostgreSQL
- Gunicorn
- Docker / Docker Compose

Do not replace these technologies unless the task explicitly requests it.

## Backend architecture

Keep the backend idiomatic Django/DRF and avoid speculative infrastructure.

The intended project shape is:

```text
backend/
├── manage.py
├── config/
├── apps/
│   └── <domain>/
├── common/
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

New Django domain apps under `apps/` must follow the canonical domain app layout used by this repository. Until an existing app provides a stricter precedent, use:

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

Domain-specific subpackages may be added only when a clear responsibility justifies them.

Do not introduce a different Django app layout without a concrete architectural reason.

## Domain boundaries

Domain-specific code must remain inside its owning `apps/<domain>/` package unless it is genuinely reusable across multiple domains or governed by a repository-wide convention.

Domain-specific code includes:

- Models
- Services
- Serializers
- Tasks
- Views
- Domain-specific validation
- Domain-specific infrastructure

Do not move code into top-level `common/` merely because multiple modules inside the same domain use it.

Shared code belongs in `common/` only when it is genuinely reusable across multiple domains, represents project-wide infrastructure, or is explicitly required there by another repository-wide convention.

Project-defined choice enums and constants are repository-wide exceptions and must follow the `Model choices` rules below.

## Domain seed data

- Domain-specific seed data belongs inside the owning app under `apps/<domain>/data/`.
- Place seed datasets in focused modules such as `apps/<domain>/data/seed_data.py`.
- Management commands should import seed data from the owning app's `data` package.
- Do not place domain seed datasets in top-level `common/` or at the root of `apps/<domain>/` when a dedicated `data/` package is appropriate.
- Image seed assets belong under `apps/<domain>/data/images/`; they may be gitignored and supplied separately.
- Seed source assets are not runtime media. Management commands must copy them through Django storage, and runtime media belongs in Django media storage.
- Keep seed data deterministic and domain-owned.
- Do not introduce runtime dependencies on frontend source files or cross-language parsing solely to load seed data.

## Domain exceptions

Domain-specific exceptions that represent a domain contract, service failure, validation outcome, or deterministic catchable error must live in:

```text
apps/<domain>/exceptions.py
```

Do not place domain-specific exceptions in `common/exceptions.py`.

Shared exceptions belong in `common/exceptions.py` only when genuinely reusable across multiple domains or project-wide infrastructure.

Services should import and raise domain exceptions from the owning app's `exceptions.py` instead of defining catchable domain exceptions inline.

## User-facing messages

Human-readable messages returned through APIs and intended for end users must be centralized in:

```text
common/messages.py
```

Do not hard-code end-user-facing error or validation messages directly in views, serializers, services, tasks, or domain exceptions.

Messages must:

- Be grouped first by language code.
- Be grouped second by owning app namespace.
- Use stable `lowercase_snake_case` message keys.
- Provide the same message key for every supported language.
- Contain only end-user-safe information.
- Never expose internal exception details, filesystem paths, commands, credentials, stack traces, or implementation details.

Use this structure:

```python
from django.conf import settings


_MESSAGES = {
    "en-us": {
        "wallpapers": {
            "not_found": "The requested wallpaper was not found.",
        },
    },
    "vi": {
        "wallpapers": {
            "not_found": "Không tìm thấy hình nền được yêu cầu.",
        },
    },
}

MESSAGES = _MESSAGES[settings.LANGUAGE_CODE]
```

Consume messages through:

```python
from common.messages import MESSAGES
```

Do not use Python built-in names such as `str`, `list`, or `dict` as local variable names.

Domain exceptions should represent deterministic error conditions independently from user-facing presentation text. The API-facing layer should map domain exceptions to user-facing messages.

Internal logging and diagnostic messages that are not exposed to end users do not belong in `common/messages.py`.

## Django and DRF conventions

- Keep views thin.
- Keep serializers focused on request validation and response representation.
- Put application workflows and business orchestration in the owning domain's `services/` package.
- Use explicit database transactions for multi-step state changes when atomicity is required.
- Prefer explicit service orchestration over Django signals for core workflows.
- Enforce ownership or the appropriate permission policy for user-scoped resources.
- Do not expose internal exceptions, filesystem paths, commands, credentials, or sensitive implementation details through API responses.
- Use `settings.AUTH_USER_MODEL` instead of importing Django's default `User` model directly.
- Generate and inspect Django migrations for model schema changes.

For resource APIs such as wallpapers:

- Use DRF `ModelViewSet` for standard list/detail/create/update/delete behavior unless a task explicitly requires a different endpoint type.
- Use DRF routers for standard resource routing.
- Prefer `django-filter`, DRF `SearchFilter`, and DRF `OrderingFilter` over manual query-parameter parsing.
- Use pagination for list endpoints expected to grow.
- Use `select_related` or `prefetch_related` when serializer access would otherwise create an obvious N+1 query.
- Do not add custom actions when standard ModelViewSet behavior or normal filtering/querying already solves the requirement.
- Prefer `slug` lookup for wallpaper detail endpoints when the wallpaper model provides a slug.

Keep Python model field names in `snake_case`. If the frontend contract requires camelCase fields, map them explicitly in serializers instead of renaming Python model fields.

Wallpaper source metadata must remain factual. Fields such as `width`, `height`, `orientation`, and `aspect_ratio` describe the original wallpaper asset and must not be changed for UI presentation purposes.

## Model choices

Do not use Django `TextChoices` or `IntegerChoices` for project-defined model choices.

Use:

```python
from common.utils.enum_choices import EnumChoices
```

Example:

```python
class Orientation(str, EnumChoices):
    LANDSCAPE = "LANDSCAPE"
    PORTRAIT = "PORTRAIT"
    ULTRAWIDE = "ULTRAWIDE"
```

Django model fields should consume enums through:

```python
choices=Orientation.choices()
```

Choice enums must be placed in `common/constants.py` under:

```text
# --------------------------------|
# Section for Class choice enums. |
# --------------------------------|
```

Constants that are not choice enums must be placed after:

```text
# -------------------------|
# Section for constants.   |
# -------------------------|
```

Do not introduce domain-level constants that violate this repository-wide convention.

## Shared utilities

Reusable pure Python utilities shared across multiple domains should live under:

```text
common/utils/
```

Small general-purpose helpers may be added to:

```text
common/utils/helpers.py
```

When a reusable concern has a clear responsibility, create a dedicated module rather than continuously growing `helpers.py`.

Examples:

```text
common/utils/helpers.py
common/utils/enum_choices.py
common/utils/path_utils.py
common/utils/hash_utils.py
```

Do not place domain-specific business logic in `common/utils/`.

Shared utilities should remain independent of Django domain models whenever practical.

## Python style

Python code must follow PEP 8 and the repository formatter/linter configuration.

Use:

- 4 spaces for indentation.
- `snake_case` for variables, functions, methods, modules, and packages.
- `PascalCase` for classes.
- `UPPER_SNAKE_CASE` for constants.
- English for source-code identifiers, comments, docstrings, configuration, and project documentation.

Organize imports in this order:

1. Python standard library.
2. Third-party packages.
3. Local project imports.

Prefer:

- Explicit names over ambiguous abbreviations.
- Readable code over clever code.
- Small focused functions over large multipurpose functions.
- Existing abstractions over duplicate implementations.
- Type hints where they improve clarity or correctness.

Avoid:

- Unnecessary abstractions.
- Generic utility classes without a clear responsibility.
- Mutable default arguments.
- Broad exception handling that silently suppresses failures.
- Unrelated refactoring during a scoped implementation task.

## Comments and human-readable messages

Sentence-like comments and human-readable message strings must begin with an uppercase letter.

This applies to:

- Code comments.
- Exception messages.
- Validation messages.
- Log messages.
- User-facing messages.
- Other sentence-like human-readable text embedded in source code.

Stable identifiers, message keys, field names, paths, commands, and other non-sentence values are excluded.

## Docstrings

Project-owned classes, functions, and methods should include docstrings when they define a meaningful responsibility, behavior, contract, or reusable interface.

Public classes, service functions, reusable utilities, and non-trivial methods must include docstrings.

Docstrings must:

- Be written in English.
- Follow PEP 257 unless overridden here.
- Use multi-line triple-quoted formatting even for short docstrings.
- Place opening and closing triple quotes on their own lines.
- Describe purpose and behavior.
- Document important arguments, return values, raised exceptions, side effects, or transactional behavior when they are not obvious from the signature.
- Remain concise and avoid repeating information already clear from names and type hints.

Use:

```python
class Wallpaper(models.Model):
    """
    Represent a persisted wallpaper asset and its source metadata.
    """
```

Do not use single-line project-owned docstrings.

Generated migrations and standard framework boilerplate may omit docstrings when behavior is self-explanatory.

## Services

Application workflows should be implemented in the owning domain's `services/` package.

Services may coordinate:

- Domain models.
- Transactions.
- External infrastructure.
- Task dispatch.
- State transitions.

Services should not depend on HTTP request or response objects.

Infrastructure-specific implementation details should remain behind appropriate boundaries instead of leaking into views, serializers, or unrelated domain code.

For simple CRUD where no workflow exists, do not invent a service merely to wrap a single ORM call. Introduce services when application orchestration or domain workflow actually exists.

## Celery

Do not add Celery unless a feature explicitly requires background execution.

If Celery is introduced later:

- Tasks should be thin execution entry points.
- Prefer task contracts based on stable identifiers.
- Do not pass unnecessary credentials, large serialized domain objects, files, or authoritative business state through task arguments.
- Assume tasks may be retried or delivered more than once.
- Domain execution logic must be idempotent where required.
- Delegate application logic to services.

## Tests

New behavior must include appropriate tests.

Test, when relevant:

- Normal behavior.
- Invalid input.
- Important failure paths.
- Domain state transitions.
- Security-sensitive boundaries.
- API list/detail behavior.
- Filtering, search, ordering, and pagination introduced by the task.

Do not weaken or remove existing tests merely to make a new implementation pass.

Keep tests consistent with the existing Django app structure.

A `tests.py` module may be promoted to a `tests/` package when the suite becomes large enough to justify it.

## File naming

Use:

```text
Python modules/packages
→ lowercase_snake_case

Project-owned Markdown files
→ lowercase-kebab-case.md

ADR files
→ adr-NNN-short-description.md
```

Preserve ecosystem-defined or tool-recognized filenames exactly, including:

```text
AGENTS.md
README.md
Dockerfile
.gitignore
.dockerignore
```

## PostgreSQL and migrations

- PostgreSQL is the database for local and production backend runtime.
- Do not introduce SQLite as an alternate application database unless a task explicitly requires it.
- Schema changes must use Django migrations.
- Inspect generated migrations before completing model changes.
- Do not edit an already-applied migration merely to reshape history unless explicitly requested.

## Docker and Gunicorn

The backend must remain runnable through Docker Compose.

- Use Gunicorn as the application server.
- Keep PostgreSQL as a separate Compose service.
- Keep secrets and environment-specific configuration outside source code.
- Maintain `.env.example` when adding environment variables.
- Do not add Nginx, Redis, Celery, or other infrastructure unless a concrete feature requires it.
- Keep Docker changes scoped to backend runtime needs.

Expected development API origin unless the task changes it:

```text
http://localhost:8000
```

## Verification

Before completing Python or Django changes, run the repository-defined checks that apply.

At minimum, once the corresponding tooling is configured:

```bash
cd backend
python -m compileall apps common config
ruff check .
ruff format --check .
python manage.py check
python manage.py makemigrations --check
python manage.py test
```

For backend Docker/runtime changes, also verify when Docker is available:

```bash
cd backend
docker compose config
docker compose build
docker compose up -d
```

If a required check cannot be executed, report that explicitly with the reason.

Do not report an implementation task as complete while required checks are failing.

## Scope discipline

Keep implementation changes scoped to the requested task.

Do not perform unrelated refactors unless required for correctness.

Do not change frontend code during a backend-only task unless explicitly requested.

If an existing convention prevents a correct implementation, identify the conflict before intentionally deviating from it.
