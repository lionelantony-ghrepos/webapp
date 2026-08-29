# Havn

A quiet, expensive-feeling travel house for the Scandinavian north. Fjords, winter light, glass cabins, dusk.

This repository is a Next.js visual shell. Stay copy lives in InsForge Postgres when configured, and in `lib/stays.ts` when it is not. There is no booking desk, no payments, and no live concierge yet.

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

The app runs without secrets. Home and stay detail read from InsForge when both `NEXT_PUBLIC_INSFORGE_*` vars are set; otherwise they use the four static stays so the homepage never blanks.

## InsForge (Postgres stays)

Do not install the CLI globally. Login is already done on Lionel's machine.

From `D:\ljarepos\webapp`:

```powershell
cd D:\ljarepos\webapp
npx @insforge/cli whoami
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

Fill the URL from the InsForge dashboard Install page (or `npx @insforge/cli current` after link). Fill the anon key from `secrets get ANON_KEY`. Never put API keys, user tokens, or other secrets in git, logs, or this README.

Equivalent npm scripts after link:

```bash
npm run db:migrate
npm run db:seed
```

Schema: `migrations/20260829120000_create_stays.sql` (slug PK, public SELECT RLS, no public writes). Seed: `seeds/stays.sql` (upserts eggum, kide, havblik, lysfjord).

## What this repo includes

- Next.js App Router, TypeScript, current Next
- Visual system: dusk palette tokens, Cormorant Garamond + Outfit, grain, glass panels
- Header (Havn wordmark) and restrained footer
- Home: full-bleed cinematic hero, short manifesto, grid of four stays
- Stay detail pages from InsForge or the same local data (`lib/stays.ts`)
- Concierge dock (UI only): placeholder message, suggested prompts, input
- InsForge SDK client, timestamped SQL migration, and seed upsert

## Later PRs

- Real concierge chat (LLM / InsForge functions)
- Auth and membership
- Booking, payments, and inquiry forms

## Photography

Remote images from [Unsplash](https://unsplash.com), used under the [Unsplash License](https://unsplash.com/license).

| Use | Photograph | Credit |
| --- | --- | --- |
| Home hero | [Norway flag at dusk](https://unsplash.com/photos/HO6aBrYi3kE) | [Mikita Karasiou](https://unsplash.com/@starpollen) |
| Eggum Lodge | [Reine, Lofoten](https://unsplash.com/photos/ut7XZMquCoU) | [Benoît Deschasaux](https://unsplash.com/@benowa) |
| Kide | [Snow mountains under stars](https://unsplash.com/photos/phIFdC6lA4E) | [Benjamin Voros](https://unsplash.com/@vorosbenisop) |
| Havblik | Manor by water (`photo-1464146072230-91cabc968266`) | Via Unsplash |
| Lysfjord | [Cabin on a mountain lake](https://unsplash.com/photos/zAjdgNXsMeg) | [Luca Bravo](https://unsplash.com/@lucabravo) |
