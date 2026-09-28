# AGENTS.md

## Project overview

This repository is an AI wallpaper website prototype.

- `frontend/` is the active application.
- `frontend/app/` uses the Next.js App Router.
- `frontend/components/` contains reusable React components.
- `frontend/data/wallpapers.ts` contains the current in-repo wallpaper data model and mock content.
- `frontend/app/globals.css` contains the current site-wide styling and responsive rules.
- `frontend/app/generate/` is the entry point for the AI wallpaper generation UI.
- `backend/` is currently a placeholder. Do not invent a backend architecture unless the task explicitly asks for one.

The current stack is Next.js 15, React 19, plain CSS, `next/image`, and Docker/Docker Compose.

## Working principles

- Implement the requested feature completely within the requested scope.
- Preserve existing behavior unless the task explicitly asks to change it.
- Do not opportunistically fix unrelated prototype behavior, navigation, search, copy, or UI details.
- Prefer small, reviewable diffs over broad refactors.
- Reuse existing components and conventions before introducing new abstractions.
- Do not introduce Tailwind, a component framework, state-management library, or another dependency unless the requested feature materially needs it.
- Do not rewrite or reformat unrelated files solely for style consistency.
- Never commit secrets. Put documented placeholders in `.env.example` when a new environment variable is required.

## Frontend architecture

- Prefer Server Components by default.
- Add `'use client'` only where browser state, effects, event-driven interactivity, or browser-only APIs require it.
- Keep route-level UI in `frontend/app/**/page.tsx` and reusable UI in `frontend/components/`.
- The application source is TypeScript-first. Do not introduce `.js`, `.jsx`, or `.mjs` application source files.
- Use `next/link` for internal route navigation.
- Use `next/image` for wallpaper and hero imagery. If a new remote image host is introduced, update `frontend/next.config.ts` intentionally.
- Keep global styling in `frontend/app/globals.css` unless a feature clearly benefits from another structure. Do not reformat the whole stylesheet for a local change.

## TypeScript

This repository uses TypeScript.

- All new source files must use TypeScript.
- Use `.ts` for non-JSX files and `.tsx` for files containing JSX.
- Do not add new `.js` or `.jsx` source files.
- Prefer explicit domain types and interfaces for shared data models and component props.
- Prefer type inference for simple local values.
- Avoid `any`; use it only when no reasonable typed alternative exists.
- Do not weaken existing types merely to make an implementation compile.
- Preserve the existing repository structure and architectural patterns unless the task explicitly requests a structural refactor.
- When implementing features, do not convert unrelated files or refactor unrelated logic.

## Wallpaper typing rules

Keep wallpaper source metadata separate from UI presentation metadata.

Source metadata such as:

- `width`
- `height`
- `orientation`
- `aspectRatio`

must describe the real wallpaper asset.

Presentation properties such as a section's thumbnail/display aspect ratio are UI concerns and must not overwrite or falsify source metadata.

## Wallpaper data invariants

Wallpaper records currently use fields such as:

- `id`
- `slug`
- `title`
- `description` when applicable
- `category`
- `width`
- `height`
- `quality`
- `orientation`
- `aspectRatio`
- `imageUrl`

Preserve source metadata truthfully. In particular, `width`, `height`, `orientation`, and `aspectRatio` describe the actual wallpaper asset and must not be falsified to make the UI uniform.

Presentation ratio is separate from source ratio. Curated rows use `section.displayAspectRatio` and pass it to `WallpaperCard`; the thumbnail may crop with `object-fit: cover` while metadata still reports the real wallpaper dimensions. Do not remove this separation unless the user explicitly requests a different gallery design.

## Responsive and accessibility expectations

- Preserve the existing dark visual language, rounded cards, responsive hero, and curated wallpaper rows.
- Desktop sections may use a grid; mobile sections use horizontally scrollable cards where appropriate.
- Interactive controls must be keyboard reachable and have an accessible label when visible text is insufficient.
- Preserve visible focus states.
- Do not rely on hover as the only way to expose an action needed on touch devices.

## Docker and local runtime

The supported local application directory is `frontend/`.

Primary commands:

```bash
cd frontend
npm ci
npm run dev
npm run build
```

Docker workflow:

```bash
cd frontend
docker compose up --build
```

Expected local URL:

```text
http://localhost:3000
```

The production Docker image uses Next.js standalone output. Preserve that model when editing Docker or Next.js runtime configuration unless the task explicitly changes the deployment strategy.

## Skill usage

Use the repository skills when they match the task:

- `$frontend-feature` for implementing or extending a frontend feature, page, interaction, or component.
- `$wallpaper-ui` for wallpaper cards, gallery rows, hero imagery, aspect ratios, responsive visual behavior, or image presentation.
- `$docker-runtime` for Dockerfile, Docker Compose, Next.js runtime/container, ports, or environment-related work.
- `$change-verification` after meaningful runtime code changes when validation is part of the task or when a build/runtime regression is plausible.

For a small task, use only the skill(s) that materially apply. Do not load every skill by default.

## Validation

Validate the narrowest useful surface for the change. For frontend runtime changes, `npm run build` is the baseline production check when dependencies are available. Do not add a test or lint framework solely to validate one change because this repository currently does not define those scripts.

If a requested feature cannot be fully verified because a service, credential, network dependency, or runtime is unavailable, finish the implementation that can be completed locally and report the exact unverified boundary.
