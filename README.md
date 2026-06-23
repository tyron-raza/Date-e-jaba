# 💌 Date e Jaba?

An interactive, animated date proposal web app that takes someone on a delightful journey — from a charming proposal screen all the way to planning the perfect date together.

---

## ✨ Features

### Stage 1 — The Proposal
- Animated bear mascot that bounces and floats
- Floating ambient hearts, sparkles, and stars drifting across the screen
- **YES** button that glows and pulses invitingly
- **NO** button that runs away — it teleports to a random position every time you try to hover or click it, gets smaller each time, and eventually disappears

### Stage 2 — The Captcha
- A playful "prove you're date-worthy" emoji grid captcha
- 3×3 grid of cute emojis; select all matching tiles (e.g. "click all the butterflies 🦋")
- Shake animation and hint on wrong answer
- Auto-passes with a funny message after 2 failed attempts — no frustrating dead ends

### Stage 3 — Date Planner
- **Date & Time** — native browser calendar and clock pickers
- **Place Search** — live location suggestions powered by the free OpenStreetMap Nominatim API (no API key required)
- **Activities** — 12 preset activity chips (Movie Night, Dinner, Karaoke, Stargazing, etc.) plus a custom "add your own" activity input
- Form validation with friendly error messages

### Stage 4 — Confirmed!
- Confetti explosion and floating hearts
- Joyful celebration message

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Animations | Framer Motion |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Routing | Wouter |
| Place Search API | OpenStreetMap Nominatim (free, no key) |
| Package Manager | pnpm (monorepo) |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- pnpm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/your-username/date-proposal.git
cd date-proposal

# Install dependencies
pnpm install

# Start the dev server
pnpm --filter @workspace/date-proposal run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
artifacts/
└── date-proposal/
    └── src/
        ├── pages/
        │   └── DateProposal.tsx   # Main page — all stages live here
        ├── components/ui/         # shadcn/ui components
        ├── App.tsx                # Router setup
        └── index.css              # Theme, fonts, CSS variables
```

---

## 🎨 Design

- **Palette:** Soft blush pink (`#FFF0F3`) with rose primary and warm brown text
- **Fonts:** Outfit (body) + Quicksand (headings) via Google Fonts
- **Animations:** Every element uses Framer Motion — staggered entrances, spring physics, and ambient looping particles

---

## 🌐 Live Demo

Deployed on Replit — [View Live App](https://your-app.replit.app)

---

## 📄 License

MIT — feel free to fork it and send it to someone special 💕
