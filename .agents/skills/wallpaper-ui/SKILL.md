---
name: wallpaper-ui
description: Implement or modify wallpaper-specific visual UI such as hero images, wallpaper cards, curated rows, gallery layouts, thumbnail cropping, aspect ratios, and responsive image behavior. Use whenever a feature changes how wallpaper assets are presented.
---

# Wallpaper UI rules

Use these rules when changing gallery, hero, wallpaper card, or image presentation behavior.

## Source metadata and presentation are different concerns

A wallpaper's `width`, `height`, `orientation`, and `aspectRatio` describe the real asset. Keep them accurate.

A UI section may deliberately present all thumbnails with a uniform ratio. The current pattern is:

1. A section declares `displayAspectRatio`, for example `16 / 9`.
2. `WallpaperSection` passes that value to `WallpaperCard`.
3. `WallpaperCard` exposes it as `--wallpaper-aspect`.
4. `.thumb` uses that ratio.
5. The `next/image` inside the thumbnail uses `object-fit: cover`.
6. Text metadata continues to display the real `width × height`.

Do not replace source dimensions with fake values to make the row look uniform.

## Image implementation

- Use `next/image`, not CSS `background-image`, for content imagery.
- Use useful `alt` text based on the wallpaper title/category.
- Provide a realistic `sizes` value for responsive cards.
- Use `priority` only for genuinely above-the-fold critical imagery such as the featured hero.
- Add a remote image hostname to `next.config.mjs` only when necessary.

## Layout behavior

- Keep cards in one curated desktop row visually aligned.
- Preserve uniform preview boxes even when the source assets include portrait, landscape, and ultrawide images.
- Mobile rows may become horizontal scrollers with `scroll-snap`.
- Do not expose a control only on hover when it must also work on touch devices.
- Avoid layout shift by giving every image container a deterministic size/aspect ratio.

## Accessibility

- Favorite/action buttons need an accessible name.
- Toggle-like controls should expose state with `aria-pressed` when state exists.
- Preserve focus-visible styling.
- Decorative overlays should not be announced by assistive technology.

## Scope discipline

When the task is only about thumbnail presentation, do not change source metadata, unrelated copy, navigation, or feature behavior.
