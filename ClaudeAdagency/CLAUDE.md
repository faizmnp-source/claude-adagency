# THECRAFTSTUDIOS — AI Reel Platform
## Claude Context File — Read This First

This file gives you full context to rebuild or continue this project from scratch.

---

## What This Project Is

An AI-powered Instagram Reel generator for Indian businesses.
- User uploads product images → AI writes a viral script → generates voiceover → generates video clips → posts to Instagram
- Live at: **https://thecraftstudios.in**
- Owner: Faiz (faiz.mnp@gmail.com / GitHub: faizmnp-source)

---

## Architecture

```
GitHub repo: github.com/faizmnp-source/claude-adagency
├── frontend/          → Next.js 14 + TypeScript → deployed on Vercel
└── reel-engine/       → Node.js + Express (ESM) → deployed on Railway
                          project: "charismatic-essence"
                          service: "reel-engine"
```

### Key URLs
- Frontend: https://thecraftstudios.in (also www.thecraftstudios.in)
- Reel Engine API: https://zoological-enthusiasm-production-1bc2.up.railway.app
- GitHub: https://github.com/faizmnp-source/claude-adagency

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS → Vercel |
| Backend | Node.js + Express (ESM modules) → Railway |
| Cache/DB | Redis (Railway managed) |
| AI Script | Anthropic Claude claude-opus-4-5 |
| AI Voice | ElevenLabs eleven_multilingual_v2 |
| AI Video | Replicate — Minimax Hailuo 720p (default), Wan 2.1 480p (budget) |
| Payments | Razorpay (India — UPI, NetBanking, Cards) |
| Domain | GoDaddy DNS → Vercel (thecraftstudios.in) |
| Video processing | FFmpeg (nixpacks) |

---

## Railway Setup

- Project name: **charismatic-essence**
- Two services:
  1. `claude-adagency` — the frontend (Next.js) — **NOT used, frontend is on Vercel**
  2. `reel-engine` — the Node.js Express API
- Root directory for reel-engine: `ClaudeAdagency/reel-engine`
- Build: nixpacks (`nixpacks.toml` with nodejs_20 + ffmpeg)
- Start command: `node src/api/server.js`

### Critical Railway lessons learned
- Port must bind IMMEDIATELY as first action — Railway healthcheck fails if you import heavy modules first
- `/health` endpoint must be purely synchronous — never touch Redis in healthcheck
- `nixpacks.toml` must include `nodejs_20` alongside ffmpeg or npm disappears
- `NEXT_PUBLIC_` env vars bake at build time — hardcode fallback URLs in frontend code
- Root Directory must be set to `ClaudeAdagency/reel-engine` in Railway service settings

---

## Environment Variables (Railway — reel-engine service)

```
ANTHROPIC_API_KEY=sk-ant-...          ✅ Set
REDIS_URL=redis://...                  ✅ Set (Railway Redis)
REPLICATE_API_TOKEN=r8_...            ✅ Set
RAZORPAY_KEY_ID=rzp_test_...          ✅ Set (test mode)
RAZORPAY_KEY_SECRET=...               ✅ Set (test mode)
FRONTEND_URL=https://thecraftstudios.in  ✅ Set
ELEVENLABS_API_KEY=sk_...             ⏳ Pending
META_ACCESS_TOKEN=...                  ⏳ Pending
META_INSTAGRAM_ACCOUNT_ID=...         ⏳ Pending
META_APP_ID=...                        ⏳ Pending
META_APP_SECRET=...                    ⏳ Pending
SUNO_API_KEY=...                       ⏳ Pending
```

---

## API Endpoints

### Reel Generation
- `POST /api/reels/generate` — generate script+content inline (Claude AI)
- `GET /api/reels/:id/status` — poll job status
- `POST /api/reels/:id/generate-video` — generate video clips via Replicate
- `GET /api/reels/:id/images/:index` — serves temp product images for Replicate
- `POST /api/reels/:id/post` — post to Instagram
- `GET /api/reels/me/credits` — get user credit balance

### Audio
- `POST /api/audio/voiceover` — generate ElevenLabs MP3 (streams back)
- `GET /api/audio/voices` — list available ElevenLabs voices
- `GET /api/audio/quota` — check remaining ElevenLabs character quota

### Payments (Razorpay)
- `GET /api/payments/packs` — list credit packs
- `POST /api/payments/order` — create Razorpay order
- `POST /api/payments/verify` — verify payment + credit user
- `GET /api/payments/balance` — user balance + history
- `POST /webhooks/razorpay` — Razorpay webhook

### System
- `GET /health` — always returns 200 (Railway healthcheck)

---

## Frontend Pages

| Page | Path | Purpose |
|---|---|---|
| Homepage | `/` | Landing page, services, pricing |
| Studio | `/studio` | AI reel generator (main feature) |
| Buy Credits | `/studio/credits` | Razorpay payment flow |
| Instagram Reels service | `/services/instagram-reels` | Service page |
| Development service | `/services/development` | Service page |
| Software service | `/services/software` | Service page |
| Contact | `/contact` | Contact form |

---

## Key Design Decisions

1. **No Stripe** — replaced with Razorpay (India-first, supports UPI/NetBanking)
2. **No S3** — product images saved as temp files on Railway, served via endpoint for Replicate
3. **No BullMQ worker** — Claude generation runs INLINE in the API route (synchronous)
4. **No Supabase** — Redis used for credits + reel results (simpler, already needed for BullMQ)
5. **Cloudflare R2 ready** — s3.js detects CF_ACCOUNT_ID and switches to R2 endpoint (free 10GB)
6. **Auth** — currently uses devAuth (seeds 9999 credits for dev-user-001). JWT auth ready but not enabled.

---

## Credit System

- Dev user: `dev-user-001` seeded with 9999 credits on first request
- Cost: 2 credits per second of reel (15s=30cr, 30s=60cr, 50s=100cr)
- Credit packs (Razorpay):
  - Starter: ₹499 / 100 credits
  - Growth: ₹1,999 / 500 credits
  - Viral: ₹3,499 / 1,000 credits

---

## Replicate Video Models

| Quality | Model | Cost | Resolution |
|---|---|---|---|
| `budget` | wavespeedai/wan-2.1-i2v-480p | ~$0.09/sec | 480p |
| `default` | minimax/hailuo-video-02-i2v | ~$0.28/6s | 720p |
| `premium` | klingai/kling-v2.5-turbo-pro-i2v | ~$0.35/5s | 1080p |

Set `REPLICATE_VIDEO_QUALITY=budget` in env for cheaper test runs.

---

## Monthly Costs

| Service | Cost |
|---|---|
| Claude API (Anthropic) | $22/month |
| Railway.app (Hobby) | $5/month |
| GoDaddy domain | ₹2,500 one-time |
| Vercel | Free |
| ElevenLabs | Free (10k chars/mo) |
| Replicate | ~₹95 per reel (pay-per-use) |

---

## How to Rebuild From Scratch

### 1. Clone the repo
```bash
git clone https://github.com/faizmnp-source/claude-adagency.git
cd claude-adagency/ClaudeAdagency
```

### 2. Deploy frontend to Vercel
- Import GitHub repo into Vercel
- Root directory: `ClaudeAdagency/frontend`
- Add env var: `NEXT_PUBLIC_REEL_ENGINE_URL=https://your-railway-url.up.railway.app`

### 3. Deploy reel-engine to Railway
- Create new project → Deploy from GitHub
- Service root directory: `ClaudeAdagency/reel-engine`
- Add Redis service to the same project
- Set all env vars from the list above
- Railway will auto-detect nixpacks.toml and build correctly

### 4. Connect domain
- GoDaddy DNS → add CNAME record pointing to Vercel
- Add `thecraftstudios.in` as custom domain in Vercel dashboard

### 5. Add API keys
In order of priority:
1. `ANTHROPIC_API_KEY` — console.anthropic.com
2. `REPLICATE_API_TOKEN` — replicate.com/account/api-tokens
3. `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` — dashboard.razorpay.com
4. `ELEVENLABS_API_KEY` — elevenlabs.io → Profile → API Keys
5. `META_ACCESS_TOKEN` + `META_INSTAGRAM_ACCOUNT_ID` — Meta Business Suite

---

## Notion Documentation
Full docs, task board, and cost breakdown:
https://www.notion.so/333393c8ae26815392b3d8ee7f0bbbc3

---

## Common Issues & Fixes

| Problem | Fix |
|---|---|
| Railway 502/healthcheck fail | Move `app.listen()` to FIRST line before all imports |
| `npm not found` in Railway build | Add `nodejs_20` to nixpacks.toml nixPkgs |
| Claude 400 "Unable to download file" | Use `type: 'base64'` not `type: 'url'` for data URI images |
| CORS blocked from www subdomain | Add both `thecraftstudios.in` and `www.thecraftstudios.in` to CORS origins |
| NEXT_PUBLIC vars undefined | Hardcode fallback URL in frontend — these bake at build time |
| Credits showing wrong number | Fetch `/api/reels/me/credits` on mount instead of using useState default |
| Redis hanging startup | Set `maxRetriesPerRequest: null`, `enableReadyCheck: false`, `lazyConnect: true` |
