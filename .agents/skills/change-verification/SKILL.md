---
name: change-verification
description: Verify meaningful code changes in the AI Wallpaper Site without expanding scope. Use after frontend/runtime modifications when a regression is plausible or when the task asks for validation.
---

# Change verification

Validate what changed; do not turn verification into an unrelated cleanup task.

## Baseline checks

For frontend TypeScript/CSS/runtime changes:

```bash
cd frontend
npm run build
```

Use `npm ci` first when dependencies are not already installed or when reproducing a clean install matters.

This repository currently has no dedicated lint or test script. Do not add a testing/linting framework solely to verify a single feature unless the user asks for it.

## Runtime checks

When the change affects routing, rendering, interactive UI, or Docker startup and the local environment supports it, run the app and verify the affected route.

For Docker-specific work, follow `$docker-runtime`.

## Review the diff

Before finishing:

- Confirm only intended files/behavior changed.
- Check for accidental formatting churn.
- Check that no secret or local-only environment value was added.
- Check responsive behavior when CSS/layout changed.
- Check source wallpaper metadata was not changed merely to solve a presentation problem.

## Report accurately

State which checks passed. If a check could not run because of missing Docker, registry/network access, credentials, or another environmental limitation, state that boundary directly rather than implying full verification.
