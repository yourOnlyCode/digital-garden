# Matthew Mullin — capsule garden & sketchbook

Personal site and digital garden. Next.js App Router, TypeScript, CSS Modules, no UI library.

@AGENTS.md

## Layout

- `src/content/sections.ts` — the sections on the line, their copy and their print. Adding a section is one entry here plus a square image in `public/prints/`.
- `src/components/Garden.tsx` — the home page: the line, the blocks, the pointer and tilt motion.
- `src/app/[section]/page.tsx` — one page per section. Currently placeholders.

## Design rules

These were settled over several rounds with Matthew. Do not drift from them without asking.

- Off-white paper (`--paper`), near-black ink (`--ink`), a light grain over everything. Green is the only accent and appears only in the glow that follows the pointer.
- The home page is one horizontal line with the sections on it. Nothing else is added to it without a strong reason.
- Section images are square crops of real public-domain prints (Cleveland Museum of Art Open Access, CC0). They are deliberately unrelated to their section. Never use generated or icon-pack artwork.
- Type: Syne 800 for the blurred white name only, Instrument Serif for titles and section names, Instrument Sans for small text.
- Motion is driven by one eased pointer position in `Garden.tsx` and written straight to the DOM, not through React state. Respect `prefers-reduced-motion`.
- Things Matthew rejected: literal garden imagery, graffiti or street-art styling, neon glow, script fonts, anything that reads as generated.

## Commands

- `npm run dev` — local server
- `npm run build` — production build
- `npm run lint` — ESLint
