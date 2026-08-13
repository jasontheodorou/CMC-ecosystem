# Working agreement — govuk-ecosystem

Terse responses. No trailing summaries. Match scope to what was asked.

This project runs on http://localhost:3001 (port set in `.env`).

## What this is

An interactive, animated ecosystem map of GOV.UK pages. Nodes are services / pages; edges are the relationships between them. Designed to be embedded as a Miro live-embed on a Miro board — but also works as a standalone web app.

## Design direction

Friendly, chilled — think Framer / React docs vibe rather than GDS civic-service. The GOV.UK connection is the *content* (real services, real URLs); the *chrome* is soft and modern.

- 16:9 canvas, letterboxed on a light sky-blue page
- Palette: soft sky-blue surface (`#e6f0fb`), white cards, jewel-tone accents per department (sky, teal, violet, amber, rose)
- Rounded corners (16–24px), soft blue-tinted shadows, no hard 2px borders
- Body text stays black/dark charcoal — no faded greys — but weights soften
- Organic node layout, curved bezier edges, gentle idle floating motion
- No dark masthead — a small floating title chip inside the canvas is enough

## Stack

- Vite + React + TypeScript
- `@xyflow/react` for the graph
- `framer-motion` for entrance/hover motion
- Hand-rolled CSS (no framework) so it stays lightweight in a Miro embed
