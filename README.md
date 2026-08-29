# Havn

A quiet, expensive-feeling travel house for the Scandinavian north. Fjords, winter light, glass cabins, dusk.

This repository is a Next.js visual shell. There is no booking desk, no payments, and no live concierge yet.

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

Environment is optional. Copy `.env.example` if you want the placeholder names; the app runs with them blank. Never add API keys to the repo.

```
NEXT_PUBLIC_INSFORGE_URL=
NEXT_PUBLIC_INSFORGE_ANON_KEY=
```

`lib/insforge.ts` installs `@insforge/sdk` and no-ops when those vars are missing.

## What this PR includes

- Next.js App Router, TypeScript, current Next
- Visual system: dusk palette tokens, Cormorant Garamond + Outfit, grain, glass panels
- Header (Havn wordmark) and restrained footer
- Home: full-bleed cinematic hero, short manifesto, grid of four static stays
- Stay detail pages from the same local data (`lib/stays.ts`)
- Concierge dock (UI only): placeholder message, suggested prompts, input
- InsForge SDK dependency and a client stub that does nothing without env vars

## Later PRs

- Real concierge chat (LLM / InsForge functions)
- Auth and membership
- Database-backed stays
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
