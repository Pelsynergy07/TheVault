---
name: taste
description: Personal design and craft philosophy for any visual output — websites, UI, decks, artifacts, mockups, or diagrams. Use this whenever building or reshaping anything visual: landing pages, dashboards, product UI, marketing sites, pitch decks, or design-system components. This is not a generic style guide — it encodes a specific, opinionated taste (obsessive polish, wild-but-controlled expression, glass/glow depth, sharp geometry, foundry-grade typography) and should override generic "clean modern SaaS" defaults. Trigger this even when the user just says "make it look good," "polish this," or "design a UI for X," not only when they explicitly mention design philosophy.
---

# Taste

This is a craft philosophy, not a style preset. Apply the judgment below to whatever is being built — don't just copy the example values.

## The core belief

**Polish is the highest priority, full stop.** Above cleverness, above trend, above the concept itself — if it isn't polished, nothing else about it matters. Polish is the proof someone cared: exact spacing, correct depth logic, deliberate motion, nothing left to default values.

Inside that non-negotiable floor of polish, **push for wild, expressive, opinionated output — not safe minimalism.** The failure mode isn't "too much personality," it's blandness. Sterile, evenly-spaced, generic-SaaS layouts are worse than a layout that takes a real risk and executes it flawlessly. Default toward boldness; restraint is a tool used deliberately, not a fallback.

Reference DNA: think **Vercel / Linear / high-end "Awwwards-tier" agency work** — deep dark canvases, glass and glow depth, asymmetric bento layouts, foundry-grade type with actual character, spring-physics motion. Explicitly **not** the soft, pill-shaped, corner-radius-everywhere "friendly SaaS" look, and explicitly not generic Inter/Roboto/Bootstrap defaults.

## Non-negotiables (violate any of these and the output fails)

- **No generic system fonts as the hero typeface.** Inter, Roboto, Arial, Helvetica, Open Sans, and system-ui are banned as display/headline faces. Reach for foundry-grade type with real character — the target quality bar is type foundries like **Pangram Pangram** (PP Neue Montreal, PP Radar, PP Mori, PP Editorial New, PP Formula), or equivalents like Söhne, Suisse Int'l, General Sans, Founders Grotesk, Space Grotesk, Instrument Serif, Jetbrains mono. Pick something with a distinct personality for headlines; a quieter workhorse is fine for body copy, but never the banned list above.
- **Default pairing when nothing more specific is briefed: Geist for display/headline/body, JetBrains Mono for anything technical/data (numbers, code, timestamps, trace lines, labels).** This is the concrete fallback — use it unless the person names something else. Geist carries the geometric-technical personality this taste wants without being a banned generic; JetBrains Mono gives data and technical UI elements a distinct, engineered voice instead of falling back to a generic monospace.
- **Sharp geometry, not soft/pill/squircle.** This taste explicitly rejects heavy rounded corners, pill buttons, and squircle cards. Default to sharp corners (0px) or a very small radius (2–4px) used consistently. If a rounded element is ever used, it must be a deliberate, rare exception — not the system default. This is the opposite instinct from most "premium" AI-design presets, which reach for `rounded-2xl` and pill everything — actively avoid that.
- **No harsh flat drop shadows, no bare 1px gray borders as the primary depth cue.** Depth comes from layered glass/blur, hairline light-catching borders, and gradient glow — not `box-shadow: 0 2px 4px rgba(0,0,0,0.3)`.
- **No `ease-in-out` / `linear` transitions, no instant state changes.** Motion always uses spring-like cubic-bezier easing (e.g. `cubic-bezier(0.32,0.72,0,1)`) and has real duration (400–900ms for entrances).
- **No overused mint/emerald green as the accent.** It's become the default "AI startup" color and reads generic on sight. Reach for purple, violet, teal, cyan, amber, or a deep blue instead — something with more specificity to the subject.

## The gradient/glow rule

Gradients and glow are welcome and encouraged — this taste likes them — but they must stay **subtle and tasteful, never the loud, saturated "AI slop" gradient blob.** Concretely:
- Prefer **large, soft, low-opacity radial gradients** (glow orbs) sitting behind content on a dark canvas, not tight, high-saturation linear gradients slapped on buttons.
- Two gradient hues max per composition, and they should feel chosen for the subject, not generic (e.g. deep violet + teal, or amber + plum) — never purple-to-blue-to-pink rainbow gradients.
- Gradient text (background-clip text) is a good tool for a hero headline — used once, not on every heading.
- If in doubt, reduce the opacity/saturation further. The gradient should read as atmosphere, not decoration.

## Operating principles

### 1. Polish is non-negotiable, wildness is encouraged within it
Every edge, gap, and transition must look intentional — but "intentional" can still mean bold. Ask: is this the safest possible version of this idea, or does it have a point of view? If it's the safe version, push it further before shipping.

### 2. Know the grid, then break it hard — on purpose
Default to asymmetric, bento-style layouts (uneven column spans, elements of different weight and size) rather than even 3-column grids. The break has to read as mastery, not accident: everything not being deliberately broken should still align to a real underlying grid. Bento asymmetry, staggered/overlapping cards, and off-center hero compositions are all fair game.

### 3. Depth over flatness
Build UI like layered physical material, not flat rectangles on a background: hairline borders that catch light, subtle glass/blur panels, soft ambient shadows or glow instead of hard drop shadows. Nested "shell + core" card construction (an outer container with its own subtle background/border, and an inner content area with its own edge treatment) reads as more considered than a single flat div — keep this technique, just execute it with sharp corners instead of the squircle/pill version.

### 4. Type carries personality, not just hierarchy
The headline face should feel chosen for this specific piece — foundry-grade, a little unexpected, with real character in its letterforms. Body copy can be quieter, but the display type is where personality lives. Tight, intentional letter-spacing on large type; never default browser tracking.

### 5. Motion should feel physical, not mechanical
Spring-physics easing everywhere. Elements enter with weight (fade + rise + slight blur resolving to sharp, or scale settling into place), not a flat opacity fade. Hover states should feel alive — magnetic buttons, nested icon elements that shift independently from their container — but always GPU-safe (`transform`/`opacity` only, never animate `top`/`left`/`width`).

### 6. One accent, chosen deliberately, never the default green
Base palette stays dark and restrained (near-black canvases read premium); the accent is one considered hue — purple, teal, amber, deep blue — applied to the one or two things that matter most (the primary CTA, a key metric, the glow). Never spread the accent everywhere; that dilutes it.

### 7. Balance expression against craft — lean toward expression
Where the earlier instinct might be "when in doubt, cut it," this taste flips that: when in doubt, and only if the polish floor is met, keep the bolder version. A flawless, wild composition beats a flawless, safe one every time. The discipline goes into execution quality, not into limiting how many ideas you allow yourself.

## Concrete craft checklist

Run through this before considering any visual output finished:

- **Corner radius**: is it sharp or near-sharp (0–4px) and consistent system-wide? No stray `rounded-full`/`rounded-2xl` defaults.
- **Typography**: is the headline face something with real character, not a banned generic sans? Is tracking/leading tuned by hand for the display sizes?
- **Accent color**: one deliberate hue, not the default green, used sparingly and with intent.
- **Gradient/glow**: subtle, low-opacity, max two hues, reads as atmosphere not decoration.
- **Depth**: does the piece use layered glass/border/glow logic instead of flat cards with a default shadow?
- **Grid**: is the layout asymmetric/bento where it can be, and does the one deliberate break clearly read as a choice?
- **Motion**: spring easing, real duration, GPU-safe properties only, no instant state changes.
- **The wildness check**: is this the safest possible version of the idea? If yes, go bolder before calling it done.

## Anti-patterns to actively avoid

- Rounded pill buttons and squircle cards as the default shape language
- Generic Inter/Roboto/system-ui headlines
- Mint/emerald green as "the" AI-product accent color
- Loud, saturated, multi-hue gradient blobs (purple-to-pink-to-blue) — gradients should whisper, not shout
- Flat, evenly-spaced, symmetric 3-column grids with no point of view
- Hard, dark, generic `box-shadow` as the only depth cue
- Linear/ease-in-out transitions or elements that appear with no motion at all
- Playing it safe when a bolder version was clearly available and still executable with full polish

## When applying this to a specific medium

These principles are medium-agnostic. When building something concrete (landing page, dashboard, deck, diagram), translate them into the medium's native constraints — e.g. for `frontend-design` work, load that skill's CSS/token guidance and apply this taste layer on top of it, not instead of it.
