# Club 404 AU

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

The official website of **Club 404**, the coding club of Aliah University, New Town Kolkata. A feature-rich platform with interactive challenges, live code execution, event management, and community features.

**Live:** [club404-page.vercel.app](https://club404-page.vercel.app/)

---

## Screenshots

| Landing Page | Code Playground | Mini Games |
|:---:|:---:|:---:|
| ![Landing](https://res.cloudinary.com/dxkje9whm/image/upload/v1759421351/Screenshot_278_l72nir.png) | ![Playground](https://res.cloudinary.com/dxkje9whm/image/upload/v1759421334/Screenshot_279_wb0cxd.png) | ![Games](https://res.cloudinary.com/dxkje9whm/image/upload/v1759421332/Screenshot_280_erhz14.png) |

| Events | Team | Contact |
|:---:|:---:|:---:|
| ![Events](https://res.cloudinary.com/dxkje9whm/image/upload/v1759421332/Screenshot_281_qzcgvc.png) | ![Team](https://res.cloudinary.com/dxkje9whm/image/upload/v1759421351/Screenshot_278_l72nir.png) | ![Contact](https://res.cloudinary.com/dxkje9whm/image/upload/v1759421334/Screenshot_279_wb0cxd.png) |

> **Note:** Screenshots are from an earlier version. Replace with updated captures after deployment.

---

## Features

- **Code Playground** — Write and run HTML/CSS/JS in a sandboxed editor with live preview
- **Daily Code Golf** — Solve coding challenges with the fewest characters; competitive leaderboard
- **Mystery Output** — Replicate target animations with HTML/CSS/JS
- **Mini-Games** — Browser-based games (Tetris, Snake, 2048, Memory)
- **Meme Generator** — Create and customize memes with templates and custom images
- **Events Dashboard** — Browse, create, and manage club events
- **Hall of Fame** — Showcase top projects, achievements, and leaderboard
- **Role-Based Auth** — Supabase authentication with super_admin, admin, moderator, member roles
- **Admin Panel** — Manage events, challenges, and access requests
- **Responsive Design** — Brutalist/cyberpunk aesthetic, works on all devices

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 19](https://react.dev) + [TypeScript 6](https://www.typescriptlang.org) |
| Build Tool | [Vite 8](https://vite.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| Auth | [Supabase](https://supabase.com) |
| State | [TanStack React Query](https://tanstack.com/query) |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Code Execution | [Piston API](https://github.com/engineer-man/piston) (self-hosted) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Charts | [Recharts](https://recharts.org) |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- [pnpm](https://pnpm.io) (recommended) or npm

### Installation

```bash
git clone https://github.com/Club404-AliahUniversity/club404Page.git
cd club404Page/client
pnpm install
```

### Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_PISTON_EXEC_URL` | Piston API endpoint (defaults to `/api/piston/execute`) | No |
| `VITE_HOF_API_URL` | Hall of Fame API base URL | No |
| `VITE_HOF_PROJECTS_BIN_ID` | Hall of Fame projects bin ID | No |
| `VITE_HOF_ACHIEVEMENTS_BIN_ID` | Hall of Fame achievements bin ID | No |
| `VITE_HOF_LEADERBOARD_BIN_ID` | Hall of Fame leaderboard bin ID | No |

### Development

```bash
pnpm dev
```

Opens at `http://localhost:8080`.

### Production Build

```bash
pnpm build
pnpm preview
```

### Linting

```bash
pnpm lint
```

---

## Project Structure

```
club404Page/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # shadcn/ui primitives (40+ components)
│   │   │   ├── About.tsx
│   │   │   ├── CodeGolf*.tsx        # Daily code golf feature
│   │   │   ├── Contact.tsx
│   │   │   ├── Events.tsx           # Events dashboard
│   │   │   ├── HallOfFame.tsx       # Hall of fame showcase
│   │   │   ├── Header.tsx           # Navigation
│   │   │   ├── Hero.tsx
│   │   │   ├── MiniGames.tsx        # Browser games
│   │   │   ├── MemeGenerator.tsx    # Meme creation
│   │   │   ├── Mystery*.tsx         # Visual replication challenge
│   │   │   ├── Playground.tsx       # Live code editor
│   │   │   ├── Services.tsx
│   │   │   ├── Team.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-auth.tsx         # Supabase auth + role checks
│   │   │   ├── use-code-golf.ts
│   │   │   ├── use-events.ts
│   │   │   ├── use-hall-of-fame.ts
│   │   │   ├── use-mystery.ts
│   │   │   └── use-playground.ts
│   │   ├── lib/                     # Utilities and configuration
│   │   │   ├── auth.ts              # Auth helper functions
│   │   │   ├── code-golf.ts         # Code golf types and logic
│   │   │   ├── config.ts            # Shared external links
│   │   │   ├── env.ts               # Centralized env config
│   │   │   ├── events.ts            # Event types and logic
│   │   │   ├── hall-of-fame.ts      # Hall of Fame API client
│   │   │   ├── languages.ts         # Supported code languages
│   │   │   ├── memes.ts             # Meme templates and types
│   │   │   ├── mini-games.ts        # Game logic and types
│   │   │   ├── mystery.ts           # Mystery challenge types
│   │   │   ├── supabase.ts          # Supabase client
│   │   │   └── utils.ts             # cn() utility
│   │   └── pages/
│   │       ├── Index.tsx            # Landing page
│   │       ├── NotFound.tsx         # 404 page
│   │       ├── AuthCallback.tsx     # OAuth callback handler
│   │       └── PlaygroundPage.tsx   # Full-page playground
│   ├── api/                         # Vercel serverless functions
│   │   └── piston/execute.js        # Piston API proxy with rate limiting
│   └── .env.example
├── piston/                          # Self-hosted Piston setup
│   ├── docker-compose.yml
│   ├── setup.sh
│   └── Caddyfile
├── supabase-schema.sql              # Database schema
└── deploy-piston.sh                 # Piston deployment script
```

---

## Deployment

### Vercel (Frontend)

1. Import the repository on [Vercel](https://vercel.com)
2. Set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Environment variables are read from `.env` (committed — all public anon keys)
5. Add `PISTON_API_URL` in Vercel dashboard (server-side env var for the API function)

### Supabase (Auth)

1. Run `supabase-schema.sql` in the Supabase SQL Editor
2. Enable GitHub and Google OAuth providers
3. Set Site URL and Redirect URLs in Authentication settings

### Piston (Code Execution)

```bash
# On your server
chmod +x deploy-piston.sh
./deploy-piston.sh
```

See [`piston/README.md`](piston/README.md) for details.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please run `pnpm lint` and `pnpm build` before submitting.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [Aliah University](https://aliah.ac.in)
- Club 404 AU core team and contributors
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Piston](https://github.com/engineer-man/piston) for code execution
