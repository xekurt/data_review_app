# Copilot Instructions for AI Agents

## Project Overview

- **Framework:** Next.js 16 (App Router, TypeScript, React 19)
- **Styling:** Tailwind CSS 4, custom theme in `tailwind.config.ts`, global styles in `app/_src/styles/globals.css`
- **Font:** Uses `next/font` for Geist and Geist Mono (see `app/layout.tsx`)
- **Directory Structure:**
  - `app/` — Main Next.js app directory (App Router)
    - `_src/components/` — React components (e.g., `header.tsx`)
    - `_src/styles/` — CSS (global styles)
    - `_src/types/` — TypeScript types (if any)
    - `layout.tsx` — Root layout, applies global styles and fonts
    - `page.tsx` — Main page entry
  - `public/` — Static assets

## Developer Workflows

- **Start Dev Server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Build:** `npm run build`
- **Start Production:** `npm run start`
- **Lint:** `npm run lint` (uses Next.js + TypeScript ESLint config)
- **No custom test scripts or test setup present.**

## Patterns & Conventions

- **Component Import:** Use relative imports from `app/_src/components/` (see `app/page.tsx`)
- **Styling:**
  - Use Tailwind utility classes for most styling.
  - Custom colors, spacing, and animations are defined in `tailwind.config.ts`.
  - Global CSS variables for background/foreground and fonts in `globals.css`.
- **Font Management:** Fonts are loaded and set as CSS variables in `layout.tsx` and referenced in CSS.
- **TypeScript:** Strict mode enabled, path alias `@/*` maps to project root (see `tsconfig.json`).
- **ESLint:** Uses Next.js core web vitals and TypeScript rules, with custom ignores in `eslint.config.mjs`.

## Integration & External Dependencies

- **No API routes, backend, or database integration present.**
- **No custom server or middleware.**
- **No environment variable usage found.**

## Examples

- **Component Usage:**
  ```tsx
  import Header from "./_src/components/header";
  // ...
  <Header />;
  ```
- **Custom Color Usage:**
  ```js
  // Use Tailwind class: bg-primary-500, text-secondary-700, etc.
  ```

## Key Files

- `app/layout.tsx` — Sets up global styles and fonts
- `app/page.tsx` — Main page, imports components
- `tailwind.config.ts` — Custom theme, colors, spacing, animations
- `app/_src/styles/globals.css` — Global CSS, variables
- `eslint.config.mjs` — Linting rules
- `tsconfig.json` — TypeScript config, path aliases

---

**For new features, follow the existing directory and import conventions. Use Tailwind for styling and reference the custom theme.**
