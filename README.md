# 🌍 Travel Log

A modern **Travel Log** web application built with **React, TypeScript, and Convex**. Discover breathtaking Indian destinations, save your favorite tours, and plan your next adventure.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Backend:** Convex (database + serverless functions)
- **Auth:** Convex Auth (password-based authentication)
- **UI:** Custom components with shadcn/ui design system
- **Icons:** Lucide React

## Features

- 🏠 **Landing Page** - Hero section, popular tours showcase, traveler stories, contact form
- 🔐 **User Accounts** - Sign up, sign in, and protected routes
- 🗺️ **Tours Dashboard** - Browse all destinations with search and difficulty filters
- 📍 **Tour Details** - Itinerary, highlights, pricing, and booking CTA
- 💾 **Saved Tours** - Bookmark your favorite destinations (stored in Convex)
- 📱 **Responsive Design** - Beautiful on desktop, tablet, and mobile

## Destinations

| Destination | Duration | Difficulty | Price |
|-------------|----------|------------|-------|
| Manali | 7 days | Medium | ₹20,000 |
| Goa | 6 days | Easy | ₹15,000 |
| Munnar | 7 days | Easy | ₹20,000 |
| Araku Valley | 5 days | Easy | ₹10,000 |
| Pondicherry | 7 days | Easy | ₹15,000 |
| Kedarnath | 7 days | Hard | ₹25,000 |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- A Convex account (for production deployment)

### Local Development

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the Convex backend (runs local dev deployment):
   ```bash
   bunx convex dev
   ```

3. Start the Vite dev server:
   ```bash
   bun run dev
   ```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
bun run build
```

Output will be in the `dist/` directory.

## Environment Variables

This project uses the following environment variables:

- `VITE_CONVEX_URL` - Your Convex deployment URL (auto-configured by `convex dev`)
- `CONVEX_DEPLOYMENT` - Convex deployment identifier (auto-configured)

No manual environment setup is needed for local development.

## Project Structure

```
src/
├── components/
│   ├── landing/        # Landing page sections
│   ├── layout/         # Navbar, Footer
│   └── ui/             # Reusable UI components
├── data/               # Tour data
├── pages/              # Route page components
├── lib/                # Utility functions
├── App.tsx             # Root component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind theme

convex/
├── auth.ts             # Auth queries/mutations
├── auth.config.ts      # Auth provider config
├── schema.ts           # Database schema
└── savedTours.ts       # Saved tours queries/mutations
```
