# Data Review Dashboard

A modern, hierarchical process management system built with Next.js 16, designed for reviewing and tracking workflows across Processes, Subprocesses, and Tasks.

## 📋 Project Overview

This application provides a comprehensive interface for managing complex review workflows with multi-level status tracking, real-time updates, and collaborative features. Built as part of the Innerspace Mini Dev Challenge, it demonstrates enterprise-grade state management, accessibility best practices, and modern React patterns.

### Key Features

#### ✅ Core Requirements (From Challenge)

- **Three-Level Hierarchy Management**: Navigate through Processes → Subprocesses → Tasks
- **Status Tracking**: Track "Pending", "Approved", and "Needs Fix" states across all levels
- **Audit Metadata**: Full tracking of `lastUpdatedBy` and `lastUpdatedAt` for all items
- **Comment System**: Add contextual comments to any Process, Subprocess, or Task
- **Activity Log**: Comprehensive changelog tracking all status changes with timestamps
- **Persistent State**: LocalStorage-based caching for offline support and instant load times
- **Sequential Workflow**: Subprocess unlocking based on completion of previous items
- **Status Propagation**: Automatic parent status updates based on child completions

#### 🎨 Enhanced Features

- **Dark Mode Support**: System-preference aware with manual toggle capability
- **Keyboard Navigation**: Full keyboard accessibility with arrow keys, Enter, Space, Tab
- **ARIA Labels & Roles**: WCAG 2.1 AA compliant accessibility implementation
- **Progress Indicators**: Visual progress bars showing completion rates
- **Modern Empty States**: Illustrated placeholders for better UX
- **Loading States**: Elegant spinner animations during data operations
- **Custom Scrollbars**: Thin, modern scrollbar styling for both themes

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript 5
- **State Management**: Zustand 5 with Immer integration
- **Styling**: Tailwind CSS 4 with custom theme
- **Data Persistence**: Browser localStorage with JSON serialization
- **Build Tools**: Turbopack (Next.js native)

### Project Structure

```
app/
├── _src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Changelog/        # Changelog table component
│   │   │   ├── ChangelogModal/   # Activity log modal
│   │   │   ├── Comments/         # Comment section container
│   │   │   ├── ListItem/         # Reusable list card component
│   │   │   ├── Loading/          # Loading spinner component
│   │   │   ├── ProgressHint/     # Progress bar component
│   │   │   └── SelectInput/      # Generic select component
│   │   ├── Processes/            # Process list view
│   │   ├── Subprocesses/         # Subprocess list view
│   │   ├── Tasks/                # Task list view
│   │   └── header.tsx            # App header with changelog button
│   ├── hooks/
│   │   ├── useChangelogData.ts   # Changelog state hooks
│   │   └── useProcessData.ts     # Process state hooks
│   ├── store/
│   │   ├── changelogStore.ts     # Changelog Zustand store
│   │   ├── processStore.ts       # Main Zustand store
│   │   └── utils/
│   │       ├── helpers.ts        # Store utility functions
│   │       └── type.ts           # TypeScript interfaces
│   ├── types/
│   │   └── process.ts            # Core data type definitions
│   ├── utils/
│   │   ├── formatters.ts         # Date/string formatting
│   │   └── progress.ts           # Progress calculation utils
│   └── styles/
│       └── globals.css           # Global styles & scrollbar
├── layout.tsx                    # Root layout with fonts
└── page.tsx                      # Main dashboard page

public/
└── data/
    └── processes.json            # Initial sample data
```

### Data Model

```typescript
interface Process {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  subprocesses: Subprocess[];
  comments: Comment[];
}

interface Subprocess {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  tasks: Task[];
  comments: Comment[];
}

interface Task {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  comments: Comment[];
}
```

### State Management Flow

1. **Initialization**: `useProcessStore` fetches from localStorage → Falls back to `processes.json`
2. **Cache Strategy**: Flattened caches (`_subprocessesCache`, `_tasksCache`) for efficient lookups
3. **Updates**: All mutations use Immer for immutability → Update caches → Persist to localStorage
4. **Selectors**: Direct cache access in hooks to prevent re-render loops
5. **Changelog**: Separate store tracks all status changes with audit trail

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd data_review_app

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Open http://localhost:3000
```

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Deploy to GitHub Pages

**Automatic Deployment (Recommended)**:
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment", select "GitHub Actions" as source
4. Push to main branch - deployment happens automatically via GitHub Actions

**Manual Deployment**:
```bash
# Build and deploy manually
npm run deploy
```

**Live Demo**: https://xekurt.github.io/data_review_app/

> **Note**: After first deployment, it may take a few minutes for GitHub Pages to become available.

## 🎯 Feature Implementation Details

### 1. Status Propagation Logic

**Task → Subprocess**:

- All tasks "Approved" → Subprocess becomes "Approved"
- Any task "Needs Fix" → Subprocess becomes "Needs Fix"
- Otherwise → Subprocess remains "Pending"

**Subprocess → Process**:

- All subprocesses "Approved" AND all tasks "Approved" → Process becomes "Approved"
- Any subprocess "Needs Fix" → Process becomes "Needs Fix"
- Otherwise → Process remains "Pending"

### 2. Sequential Workflow

Subprocesses unlock sequentially:

- First subprocess always unlocked
- Subsequent subprocesses require previous subprocess's tasks to be 100% approved
- Visual indication via opacity and disabled state

### 3. Accessibility Features

- ✅ Semantic HTML with proper heading hierarchy
- ✅ ARIA labels on all interactive elements
- ✅ ARIA roles (list, listitem, dialog, banner, main, region)
- ✅ ARIA states (expanded, selected, disabled, live)
- ✅ Focus indicators with ring styles
- ✅ Skip navigation patterns
- ✅ Screen reader announcements for status changes
- ✅ Keyboard-only navigation support

### 4. Data Persistence Strategy

- **Initial Load**: Check localStorage → Fetch JSON if empty/corrupted
- **Updates**: Automatic save to localStorage on every mutation
- **Cache Invalidation**: Manual localStorage clear triggers fresh fetch
- **Error Handling**: Try-catch with fallback and console logging

## 📊 Data Sample Generation

- **AI Tool Used**: GitHub Copilot (GPT-4.1)
- **Prompt**: "Generate realistic data: 2–3 Processes, each with 2–4 Subprocesses, each with 3–6 Tasks. Fields per item: id, name, description, status (Pending | Approved | Needs Fix), lastUpdatedBy, lastUpdatedAt."
- **Manual Adjustments**: None; all data and structure generated by AI
- **Location**: `public/data/processes.json`

## 🎨 Design System

### Color Palette

- **Primary**: Teal (#14a8c9) - Actions, focus states
- **Secondary**: Green (#22c55e) - Success, approved
- **Status Colors**:
  - Pending: Yellow (#fbbf24)
  - Approved: Green (#22c55e)
  - Needs Fix: Red (#ef4444)

### Typography

- **Font Family**: Geist Sans (UI), Geist Mono (Code)
- **Scale**: sm (12px) → base (16px) → lg (18px) → xl (20px) → 2xl (24px)

### Spacing Scale

Uses Tailwind's default rem-based scale (0-96) with consistent gaps and padding.

### Animations

- `fade-in`: 300ms opacity transition
- `slide-up`: 400ms transform + opacity
- `spin`: Continuous rotation for loading states
- `pulse`: Breathing effect for loading text

## 🧪 Testing the Application

### Manual Test Cases

1. **Status Propagation**:

   - Set all tasks in a subprocess to "Approved" → Verify subprocess auto-approves
   - Set all subprocesses + tasks to "Approved" → Verify process Pending

2. **Sequential Workflow**:

   - Try clicking second subprocess before completing first → Should be disabled
   - Complete all tasks in first subprocess → Second should unlock

3. **Persistence**:

   - Make changes → Refresh page → Verify changes persist
   - Open DevTools → Clear localStorage → Refresh → Data reloads from JSON

4. **Keyboard Navigation**:

   - Use Tab to navigate through all interactive elements
   - Use Arrow keys on status selects
   - Use Enter/Space to toggle comments

5. **Changelog**:
   - Make status changes → Open Activity Log → Verify entries with timestamps
   - Check order (newest first)

## 🔧 Configuration Files

- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Custom theme, colors, animations
- `tsconfig.json`: TypeScript compiler options
- `eslint.config.mjs`: Linting rules
- `postcss.config.mjs`: PostCSS with Tailwind

## 📝 Code Patterns & Conventions

### Component Structure

- Use `"use client"` for interactive components
- Hooks at top, handlers grouped, early returns for loading/error states
- Destructure from custom hooks, not direct store access

### State Updates

- Always use Immer's `produce` for nested updates
- Update `lastUpdatedAt` on every mutation
- Recalculate caches after mutations affecting nested data

### Styling

- Utility-first with Tailwind
- Dark mode via `dark:` prefix
- Consistent spacing using Tailwind scale

### Accessibility

- Wrap interactive divs with semantic HTML when possible
- Add ARIA labels to all custom controls
- Provide keyboard alternatives for all mouse actions
- Test with keyboard-only navigation

## 🚧 Known Limitations

- No backend integration (localStorage only)
- No user authentication system
- No real-time collaboration features
- No data export functionality
- No advanced filtering/search

## 🔮 Future Enhancements

- [ ] Backend API integration (REST/GraphQL)
- [ ] Real-time updates with WebSockets
- [ ] User authentication & permissions
- [ ] Advanced search & filtering
- [ ] Bulk operations (multi-select)
- [ ] Data export (CSV, PDF)
- [ ] File attachments on comments
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

---

**Built with ❤️ using Next.js 16, React 19, TypeScript, Zustand, and Tailwind CSS**
