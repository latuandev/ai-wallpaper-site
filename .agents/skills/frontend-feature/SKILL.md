---
name: frontend-feature
description: Implement or extend a feature in the AI Wallpaper Site Next.js frontend, including pages, components, forms, client interactions, and local mock-data integration. Use when the task changes application behavior or adds a user-facing frontend feature.
---

# Frontend feature workflow

Implement the requested feature using the existing Next.js App Router architecture and repository conventions.

## 1. Locate the smallest implementation surface

Read only the files needed for the task. Typical locations are:

- `frontend/app/<route>/page.js` for route UI.
- `frontend/components/` for reusable components.
- `frontend/data/wallpapers.js` for the current mock wallpaper source.
- `frontend/app/globals.css` for styling.
- `frontend/next.config.mjs` only when Next.js configuration must change.

Do not refactor unrelated prototype behavior while implementing the feature.

## 2. Choose the Server/Client boundary deliberately

Prefer a Server Component when the UI can render from props/data without browser state.

Use a Client Component only when the feature needs one or more of:

- React state.
- Event handlers that mutate UI state.
- effects.
- browser APIs.
- interactive form behavior that cannot stay server-rendered.

Keep the client boundary as small as practical instead of converting an entire route to a Client Component.

## 3. Reuse before adding

Before adding a new component, check whether `Header`, `Hero`, `WallpaperCard`, or `WallpaperSection` can be extended cleanly.

Create a new reusable component when the feature has a clear responsibility or will otherwise make a route/component difficult to understand.

Do not add a third-party dependency for behavior that React, Next.js, or CSS can implement simply.

## 4. Keep data explicit

When temporary data is needed, use clear objects rather than positional arrays. Preserve the existing wallpaper schema when dealing with wallpaper records.

Do not fabricate source dimensions or aspect ratios for layout purposes. Use presentation properties separately from asset metadata.

## 5. Style consistently

Match the existing dark theme and spacing language. Add targeted rules to `frontend/app/globals.css`; do not reformat the entire file.

Account for desktop and mobile behavior. Verify that an interactive desktop affordance is still usable on touch devices.

## 6. Finish the feature

Implement all code needed for the user-visible flow requested in the task. Avoid leaving placeholder handlers or dead controls unless the task explicitly asks for a visual-only prototype.

When appropriate, use `$wallpaper-ui` for wallpaper/image presentation details and `$change-verification` for final validation.
