# AGENTS.md

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

ASSMA Production Studio is a frontend-only music production dashboard. It provides a UI for uploading vocals and stems, selecting production styles, tracking pipeline progress, comparing A/B audio versions, reviewing audio metrics, and downloading finished masters. The actual audio processing runs on an external VPS API — this app is the control panel.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 with custom oklch theme tokens |
| Icons | Lucide React |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
src/
├── components/               # Reusable UI components
│   ├── Layout.tsx            # App shell with sidebar nav and top header
│   ├── ProjectCard.tsx       # Project summary card used in list views
│   ├── UploadDropzone.tsx    # Drag-and-drop file upload for WAV files
│   ├── StyleCard.tsx         # Production style selector card
│   ├── ProgressTimeline.tsx  # Pipeline step progress indicator
│   ├── AudioPlayer.tsx       # A/B comparison audio player UI
│   ├── MetricsPanel.tsx      # Audio metrics display (LUFS, true peak, LRA, stereo width, codec QC)
│   └── DownloadPanel.tsx     # Download buttons for master files
├── lib/
│   ├── types.ts              # All TypeScript interfaces (Project, Style, AudioMetrics, etc.)
│   ├── mock-data.ts          # Mock data for development — replace with API calls
│   └── api.ts                # API client utility using VITE_API_BASE_URL
├── routes/
│   ├── __root.tsx            # Root layout: HTML shell, Layout component, font loading
│   ├── index.tsx             # Dashboard home: stats cards, recent projects
│   ├── productions.new.tsx   # New production wizard: upload → style → review
│   ├── projects.tsx          # Projects layout route (renders Outlet for children)
│   ├── projects.index.tsx    # Project list with search and status filters
│   ├── projects.$projectId.tsx # Project detail: timeline, player, metrics, downloads
│   ├── styles.tsx            # Style library: browse/filter production styles
│   └── settings.tsx          # Settings page for API URL configuration
├── router.tsx                # TanStack Router configuration
└── styles.css                # Tailwind CSS imports + custom theme tokens (oklch colors)
```

## Key Architecture Decisions

### Frontend Only
No audio processing happens in this app. All WAV file handling is delegated to an external VPS API. The frontend handles file upload UI, progress tracking, and result display. The API base URL is configured via the `VITE_API_BASE_URL` environment variable.

### Mock Data Pattern
All pages use mock data from `src/lib/mock-data.ts`. To connect to the real API, replace mock data imports with calls to `src/lib/api.ts`. The mock data follows the exact type interfaces the real API should return.

### Custom Theme
The app uses a dark music-studio theme with oklch color tokens defined in `src/styles.css` under `@theme`. Colors use the `studio-*` scale for neutrals and `accent-*` for highlights (violet, cyan, green, red, amber).

### File-Based Routing
Routes follow TanStack Router's file-based routing convention. The route tree is auto-generated. Dynamic segments use `$paramName` (e.g., `projects.$projectId.tsx`).

## Conventions

### Naming
- Components: PascalCase (`ProjectCard.tsx`)
- Utilities: camelCase (`mock-data.ts`, `api.ts`)
- Routes: kebab-case with TanStack dot notation (`projects.index.tsx`)

### Styling
- Tailwind CSS utility classes throughout
- Theme colors: `studio-*` (neutrals 100–900), `accent-violet`, `accent-cyan`, `accent-green`, `accent-red`, `accent-amber`
- All backgrounds use `studio-800` or `studio-900`; borders use `studio-700`

### TypeScript
- Strict mode enabled
- Import paths use `@/` alias pointing to `src/`
- Type-only imports where applicable

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend VPS API URL |

## Development Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
```

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite plugins: TanStack Start, Netlify, Tailwind |
| `tsconfig.json` | TypeScript config with `@/*` path alias for `src/*` |
| `netlify.toml` | Build command, output directory, dev server settings |
| `styles.css` | Tailwind imports + CSS custom properties (oklch colors) |
