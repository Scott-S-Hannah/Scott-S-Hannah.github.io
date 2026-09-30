# DESIGN.md

Tokens live in `src/styles/tokens.css`. This file documents intent; the CSS is the source of truth.

## Color

Strategy: **Restrained**. Tinted slate neutrals plus one teal accent used as data ink, never decoration.

- Paper `--paper #f6f8f9`, raised surface `--surface #fbfcfd`, recessed panel `--surface-2 #eaeef1`.
- Ink `--ink #10161a`, soft ink `--ink-soft #2b3238`, muted `--mut`, faint `--faint` (metadata; both clear WCAG AA 4.5:1 on every surface they sit on), `--ghost` (large/bold de-emphasis only, 3:1 floor).
- Teal ramp: `--teal #02abbf` (marks), `--teal-deep #09747f` (text links on light), `--teal-bright #06c2d6` (marks on dark), `--teal-wash #e3f3f4` (tint panels).
- Dark band: `--feature #10161a` with `--on-feature` text ramp.
- Never #000 or #fff. Never a second accent hue.

## Typography

- One family: **Switzer** (self-hosted woff2, weights 400/500/600/700). No display/body split; hierarchy is scale and weight.
- Fluid modular scale `--step--1` … `--step-4` via clamp(). Body at `--step-0`, max measure 65ch.
- Tabular numerals (`font-variant-numeric: tabular-nums`) are a brand motif: years, indices, counts all set tabular.
- The teal full stop after headings is a registration mark; use sparingly, one per section at most.

## Layout

- Container `--maxw 76rem`, fluid gutter `--gutter`.
- Sections alternate light paper and dark slate bands; the hero runner's ground line is the recurring horizontal datum.
- Avoid equal-column card grids in consecutive sections; alternate structural verbs (row list, asymmetric split, ledger).

## Motion

- GSAP reveal layer on scroll; hero canvas is bespoke (no three.js at runtime, baked JSON replay).
- All motion honours `prefers-reduced-motion`. Ease out only, no bounce.
- Content must survive script failure: reveal hidden-states applied in JS, not CSS.

## Components

- `GenerativeHero`: baked run cycle on 2D canvas, particle wake settling toward the wordmark, poster fallback.
- `PublicationItem`: finding-first treatment; year set large in tabular figures, formal title as metadata.
- Footer: dark slate bookend; the runner glyph stands on the hero's ground line.
