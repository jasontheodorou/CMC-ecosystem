# govuk-ecosystem

Interactive, animated ecosystem map of GOV.UK pages — designed to drop into a Miro board as a live embed, works standalone too.

Runs on http://localhost:3001 — see `.env`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3001.

## Drop it into Miro

1. Deploy the app to any static host with a public HTTPS URL. Vercel, Netlify or Cloudflare Pages each take a Vite build straight from a git repo.
2. On your Miro board, click the `+` menu → **Embed** → paste the deployed URL.
3. Resize the embed frame so the map has room to breathe.

Miro keeps the iframe interactive, so pan, click and hover all work inside the board. The tradeoff for the live-embed route: collaborators can't drag individual nodes onto the Miro canvas — the map lives inside its embed frame. If that becomes important later, the alternative is a Miro custom app using the Web SDK, which renders as real Miro shapes.

## Design

GOV.UK palette and vibe, but a step ahead of where GDS is today. Palette and typography tokens live in `src/index.css`. Nodes and edges are defined in `src/data.ts` — add a new GOV.UK page there and it'll show up on the map.

## Stack

- Vite + React + TypeScript
- `@xyflow/react` for the graph
- `framer-motion` for entrance and hover motion
- Hand-rolled CSS (no framework) to keep the embed lightweight
