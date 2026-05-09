# ASSMA Production Studio

A modern, dark-themed music production dashboard built with TanStack Start, React 19, and Tailwind CSS 4. This is a **frontend-only** application — the real audio processing engine runs on an external VPS API.

## Features

- **Dashboard** — Overview of projects, stats, and quick access to new productions
- **New Production** — Multi-step wizard with drag-and-drop WAV upload, style selection, and review
- **Projects** — Searchable and filterable project list with status tracking
- **Project Detail** — Full pipeline view with progress timeline, A/B audio player, metrics panel (LUFS, true peak, LRA, stereo width, codec QC), and download buttons
- **Style Library** — Browse and filter production styles by genre
- **Settings** — Configure the backend API URL

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

The dev server runs on `http://localhost:3000`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend VPS API URL (e.g. `https://your-vps.example.com/api`) |

Set this in your Netlify site settings or `.env.local` file. The app uses mock data until a real API is connected.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx       # App shell: sidebar + header
│   ├── ProjectCard.tsx  # Project list card
│   ├── UploadDropzone.tsx # Drag-and-drop file upload
│   ├── StyleCard.tsx    # Production style selector
│   ├── ProgressTimeline.tsx # Pipeline step tracker
│   ├── AudioPlayer.tsx  # A/B comparison player
│   ├── MetricsPanel.tsx # Audio metrics display
│   └── DownloadPanel.tsx # Download buttons
├── lib/
│   ├── types.ts         # TypeScript interfaces
│   ├── mock-data.ts     # Mock data for development
│   └── api.ts           # API client utility
├── routes/
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard home
│   ├── productions.new.tsx # New production wizard
│   ├── projects.tsx     # Projects layout
│   ├── projects.index.tsx # Project list
│   ├── projects.$projectId.tsx # Project detail
│   ├── styles.tsx       # Style library
│   └── settings.tsx     # Settings page
├── router.tsx           # TanStack Router config
└── styles.css           # Global styles + Tailwind theme
```
