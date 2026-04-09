# Pyadra

> **The Path of Light** — An interconnected ecosystem of creative and ritual digital experiences.

Pyadra is not a product. It is a ceremonial space where digital artifacts are forged with intention, preserved with care, and experienced with reverence. Each project within the ecosystem serves as a node in a larger constellation of meaningful human connection.

**📖 New here?** Read **[VISION.md](VISION.md)** first to understand what Pyadra is and where it's going.

## 🌟 Live Projects

### [Orbit 77](https://pyadra.io/exhibitions/galaxy/orbit)
A podcast and media platform exploring liminal spaces and hidden knowledge. 10 episodes released. Supporter-funded model with transparent funding goals ($1000 AUD). Includes a credentials system for early supporters.

### [EterniCapsule](https://pyadra.io/exhibitions/galaxy/ethernicapsule)
Time-locked digital message vaults. Write a letter, seal it cryptographically, and have it delivered to recipients at a future date. Each capsule costs $9 AUD and is permanently preserved. Features include:
- Cryptographic sealing ceremony
- Multiple guardians support
- Grace period for edits
- 3D monolith visualization
- Email delivery with audio crystallization (432Hz)

## 🌱 Forming Projects

- **Figurines** — Hyper-personalized 3D figures (physical + digital)
- **Unknown Node** — Early stage, unnamed initiative

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **3D/Graphics**: Three.js, React Three Fiber (R3F), Drei
- **Animation**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Email**: Resend
- **Styling**: Tailwind CSS v4
- **Audio**: 432Hz frequency tuning

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/pyadra.git
cd pyadra
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Stripe keys from [dashboard.stripe.com](https://dashboard.stripe.com/apikeys)
- Supabase URL and service key from [app.supabase.com](https://app.supabase.com)
- Resend API key from [resend.com](https://resend.com/api-keys)

4. Setup database
```bash
# Run Supabase migrations
npx supabase db push
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📜 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## 📁 Project Structure

```
pyadra/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                     # API routes (Stripe, email, cron)
│   │   ├── exhibitions/             # Exhibition system
│   │   │   ├── page.tsx            # Exhibition selector
│   │   │   └── galaxy/             # Galaxy exhibition (MVP1)
│   │   │       ├── page.tsx        # 3D navigation scene
│   │   │       ├── ethernicapsule/ # Time-locked messages
│   │   │       ├── orbit/          # Orbit 77 podcast
│   │   │       └── figurines/      # Digital artifacts
│   │   ├── lib/                     # Utilities (db, email, validation)
│   │   └── page.tsx                 # Homepage (Observer initiation)
│   └── middleware.ts                # Request middleware + redirects
├── public/                           # Static assets
├── supabase/
│   └── migrations/                  # Database migrations
├── docs/                             # Documentation
│   ├── HOME_EXPERIENCE.md           # Home page system
│   ├── ETERNICAPSULE_NODE.md        # EterniCapsule context
│   ├── ORBIT_NODE.md                # Orbit 77 context
│   ├── FIGURINES_NODE.md            # Figurines context
│   └── URL_MIGRATION.md             # Recent URL structure changes
├── VISION.md                         # ⭐ Start here - Core philosophy
├── ARCHITECTURE.md                   # System design
└── package.json
```

## 🎨 Design Philosophy

Pyadra projects follow a **ceremonial UX** approach:
- Actions feel like "sealing", "transmission", "opening"
- Audio tuned to 432Hz (natural harmonic frequency)
- High intentionality in every interaction
- Dark, minimal aesthetic with gold accents (#FFB000)
- Typography: Cormorant Garamond (serif), system sans-serif
- Color palette: Deep blacks, warm beiges, ritual gold

## 🔐 Security

- All sensitive operations use Supabase Service Role Key (backend-only)
- Stripe webhooks verify signatures
- XSS protection in user-generated content
- Row-level security (RLS) in Supabase

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📚 Documentation

### Core Documents
- **[VISION.md](./VISION.md)** — ⭐ **START HERE** - What Pyadra is, why it exists, where it's going
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design and data flows
- [docs/HOME_EXPERIENCE.md](./docs/HOME_EXPERIENCE.md) — Observer initiation system

### Project Nodes
- [docs/ETERNICAPSULE_NODE.md](./docs/ETERNICAPSULE_NODE.md) — EterniCapsule context for AI agents
- [docs/ORBIT_NODE.md](./docs/ORBIT_NODE.md) — Orbit 77 context for AI agents
- [docs/FIGURINES_NODE.md](./docs/FIGURINES_NODE.md) — Figurines context for AI agents

### Recent Changes
- [docs/URL_MIGRATION.md](./docs/URL_MIGRATION.md) — April 2026 URL structure migration

## 🌍 Deployment

Pyadra is designed to be deployed on [Vercel](https://vercel.com):

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy

### Environment Variables Required:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

## 🤝 Contributing

We welcome contributions that align with Pyadra's ceremonial philosophy. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting pull requests.

## 📄 License

Proprietary — All rights reserved.

## 📞 Contact

- **Email**: [pyadra@pyadra.io](mailto:pyadra@pyadra.io)
- **Website**: [pyadra.io](https://pyadra.io)

---

*Built with intention. Preserved with care. Experienced with reverence.*
