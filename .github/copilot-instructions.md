# Copilot Instructions for AI Agents

## Project Overview

**Data Review Dashboard** — A Next.js 16 app for managing hierarchical process workflows (Processes → Subprocesses → Tasks), each with status tracking and audit metadata. Features client-side state management with Zustand, localStorage persistence, and a Tailwind-styled dashboard UI.

- **Framework:** Next.js 16 (App Router, TypeScript, React 19)
- **State Management:** Zustand 5 for global process state
- **Styling:** Tailwind CSS 4 with custom theme and dark mode support
- **Data Source:** Static JSON (`public/data/processes.json`) loaded on app init via fetch

## Architecture & Data Flow

### Hierarchical Data Model

Three-level nested structure defined in `app/_src/types/process.ts`:

- **Process** (root level): Major workflow units with 2–3 subprocesses each
- **Subprocess**: Represents process phases, contains 3–6 tasks
- **Task**: Atomic work units
- All levels share: `id`, `name`, `description`, `status` ("Pending" | "Approved" | "Needs Fix"), `lastUpdatedBy`, `lastUpdatedAt`

### State Management (Zustand Store)

**File:** `app/_src/store/processStore.ts`

Core responsibilities:

- **Single source of truth:** `processes[]` array holds all data
- **Selection state:** Tracks active process/subprocess/task for UI context
- **Initialization:** On first app load, fetches `processes.json`, caches to localStorage, then persists all updates
- **Computed selectors:** `getSubprocesses()` and `getTasks()` flatten nested data with
- **localStorage key:** Defined in `app/_src/store/constants.ts` as `STORAGE_KEYS.PROCESSES`

### React Hooks Layer

**File:** `app/_src/hooks/useProcessData.ts`

Three custom hooks expose store slices:

- `useProcessData()` — Main processes, selected process, loading/error state, update methods
- `useSubprocessData()` — Flattened subprocesses with parent process context
- `useTaskData()` — Flattened tasks with full parent hierarchy context
- `useInitializeProcesses()` — Effect hook that triggers store initialization (call in root)

**Usage pattern:** Components wrap logic in `"use client"` and call hooks to subscribe to state slices.

## Developer Workflows

- **Start Dev:** `npm run dev` → http://localhost:3000
- **Build:** `npm run build`
- **Production:** `npm run start`
- **Lint:** `npm run lint` (Next.js + TypeScript ESLint, see `eslint.config.mjs`)

## Patterns & Conventions

### Component Structure

- **Client Components:** Use `"use client"` pragma for any component that hooks into Zustand or uses React state
- **Dark Mode:** Build-in support via Tailwind's `dark:` classes (see `header.tsx`, `Processes/index.tsx`)
- **Import Style:** Relative imports from `app/_src/components/`

**Example:**

```tsx
"use client";
import { useProcessData } from "../hooks/useProcessData";
export default function ProcessList() {
  const { processes, selectedProcess, setSelectedProcess } = useProcessData();
  // ...
}
```

### Styling Conventions

- **Palette:** Primary (teal, `#14a8c9`), Secondary (green, `#22c55e`), Status colors (success/warning/error)
- **Spacing scale:** 0–96 (rem-based, see `tailwind.config.ts`)
- **Border radius:** sm/md/lg/xl/full for consistent UI shaping
- **Animations:** `fade-in` (300ms) and `slide-up` (400ms) pre-defined
- **Shadows:** Use `shadow-card` for elevated surfaces (e.g., process cards)

**Example:**

```tsx
<div className="bg-primary-500 dark:bg-primary-900 text-white p-6 rounded-lg shadow-card">
  Status: {process.status}
</div>
```

### Nested Data Updates

When updating nested task/subprocess in a process, always:

1. Map the `processes` array
2. Find target process by ID
3. For subprocess/task updates, map the respective nested array
4. Always set `lastUpdatedAt` to current ISO timestamp
5. Return new object to maintain immutability

### localStorage Persistence

- Store auto-saves on every update via `setProcesses()`
- Init reads from cache first before fetching JSON (1.5s simulated delay)
- Key: `"process-store"` — never change without migration plan

## File Reference

| File                               | Purpose                                          |
| ---------------------------------- | ------------------------------------------------ |
| `app/_src/types/process.ts`        | TypeScript interfaces: Task, Subprocess, Process |
| `app/_src/store/processStore.ts`   | Zustand store with state, selectors, mutations   |
| `app/_src/hooks/useProcessData.ts` | Three custom hooks + initialization hook         |
| `app/_src/store/constants.ts`      | localStorage key constant                        |
| `public/data/processes.json`       | Sample data (3 processes, 5–7 tasks per parent)  |
| `tailwind.config.ts`               | Custom colors, spacing, animations, shadows      |
| `app/layout.tsx`                   | Root layout, fonts (Geist Sans/Mono), global CSS |
| `app/page.tsx`                     | Main page entry (Header + Processes component)   |

## Key Implementation Decisions

1. **Zustand over Context API:** Reduces re-render overhead for large nested structures; easy selector-based subscriptions
2. **localStorage Caching:** Enables offline UX and instant init on repeat visits (serves cache, fetches in background if needed)
3. **Flat selectors (`getSubprocesses`, `getTasks`):** Simplifies rendering filtered lists without manual parent traversal in components
4. **Simulated 1.5s fetch delay:** Allows testing loading states; remove for real API integration
5. **No API routes:** All data static; JSON fetch is placeholder for future REST integration

---

**When adding features:** Follow Zustand mutation patterns, persist to store before UI updates, use `"use client"` in interactive components, and leverage Tailwind's semantic color names (primary/secondary/success/warning/error).
