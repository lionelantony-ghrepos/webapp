# Havn

A quiet, expensive-feeling travel house for the Scandinavian north. Fjords, winter light, glass cabins, dusk.

This repository is a Next.js visual shell. Stay copy lives in InsForge Postgres when configured, and in `lib/stays.ts` when it is not. Signed-in guests can send a stay inquiry. The concierge dock talks to an InsForge edge function when the project is configured.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

The app runs without secrets. Home and stay detail read from InsForge when both `NEXT_PUBLIC_INSFORGE_*` vars are set; otherwise they use the four static stays. Auth, the request form, and the concierge dock still render when env is blank; they explain that the backend is unconfigured instead of crashing.

## InsForge (Postgres stays + requests + concierge)

Do not install the CLI globally. Login is already done on Lionel's machine. Stays and stay requests were already migrated locally.

### Concierge function (this PR)

Chat is session-only in the browser (React state). There is no chat-history migration; anon RLS for ephemeral threads is messy, so this PR does not persist threads.

From `D:\ljarepos\webapp`, after `npx @insforge/cli whoami` succeeds:

```powershell
cd D:\ljarepos\webapp
npx @insforge/cli whoami
npx @insforge/cli functions deploy concierge-chat --file .\functions\concierge-chat.ts --name "Concierge chat" --description "Stay-grounded Havn concierge"
npx @insforge/cli functions list
```

Equivalent:

```bash
npm run functions:deploy
```

The function calls OpenRouter (`https://openrouter.ai/api/v1/chat/completions`) with the project key. It is a function secret, not a Next.js env var. Never commit the key.

```powershell
npx @insforge/cli ai setup
npx @insforge/cli secrets add OPENROUTER_API_KEY PASTE_THE_KEY_HERE
```

`ai setup` writes `OPENROUTER_API_KEY` to a gitignored `.env.local` for local reference. Copy that same value into `secrets add`. Do not prefix it `NEXT_PUBLIC_`. Optional: `OPENROUTER_CHAT_MODEL` (default `openai/gpt-4o-mini`). Optional for a live catalog inside the function: `INSFORGE_BASE_URL` and `ANON_KEY` (the function already falls back to the four static stays).

No new SQL migration in this PR.

### Stays and stay requests (already applied locally)

```powershell
npx @insforge/cli link
npx @insforge/cli db migrations up --all
npx @insforge/cli db import .\seeds\stays.sql
npx @insforge/cli secrets get ANON_KEY
Copy-Item .env.example .env.local
```

Then edit `.env.local` (never commit it):

```
NEXT_PUBLIC_INSFORGE_URL=https://YOUR_PROJECT.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=
```

Fill the URL from the InsForge dashboard Install page (or `npx @insforge/cli current` after link). Fill the anon key from `secrets get ANON_KEY`. Never put API keys, user tokens, OpenRouter keys, or other secrets in git, logs, or this README.

Equivalent npm scripts after link:

```bash
npm run db:migrate
npm run db:seed
```

Schema:

- `migrations/20260829120000_create_stays.sql` — slug PK, public SELECT RLS, no public writes
- `migrations/20260829153000_create_stay_requests.sql` — guest inquiries, owner INSERT/SELECT RLS, no anon INSERT, no public SELECT of others' rows

Seed: `seeds/stays.sql` (upserts eggum, kide, havblik, lysfjord). Auth is email OTP via `@insforge/sdk` (`signInWithOtp` / `verifyOtp`). Concierge: `functions/concierge-chat.ts`, invoked with `client.functions.invoke('concierge-chat')`.

## What this repo includes

- Next.js App Router, TypeScript, current Next
- Visual system: dusk palette tokens, Cormorant Garamond + Outfit, grain, glass panels
- Header (Havn wordmark) and restrained footer
- Home: full-bleed cinematic hero, short manifesto, grid of four stays
- Stay detail pages from InsForge or the same local data (`lib/stays.ts`)
- Concierge dock: live chat when InsForge is configured; suggested prompts send; unconfigured env explains itself
- InsForge SDK client, timestamped SQL migrations, seed upsert, Deno edge function source
- Email OTP sign-in in the header; stay detail “Request this stay” inquiry (session required)

## Later PRs

- Booking and payments

## Photography

Remote images from [Unsplash](https://unsplash.com), used under the [Unsplash License](https://unsplash.com/license).

| Use | Photograph | Credit |
| --- | --- | --- |
| Home hero | [Norway flag at dusk](https://unsplash.com/photos/HO6aBrYi3kE) | [Mikita Karasiou](https://unsplash.com/@starpollen) |
| Eggum Lodge | [Reine, Lofoten](https://unsplash.com/photos/ut7XZMquCoU) | [Benoît Deschasaux](https://unsplash.com/@benowa) |
| Kide | [Snow mountains under stars](https://unsplash.com/photos/phIFdC6lA4E) | [Benjamin Voros](https://unsplash.com/@vorosbenisop) |
| Havblik | Manor by water (`photo-1464146072230-91cabc968266`) | Via Unsplash |
| Lysfjord | [Cabin on a mountain lake](https://unsplash.com/photos/zAjdgNXsMeg) | [Luca Bravo](https://unsplash.com/@lucabravo) |
