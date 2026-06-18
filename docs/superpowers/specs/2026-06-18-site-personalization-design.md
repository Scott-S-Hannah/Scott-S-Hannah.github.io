# Site Personalization — Bold-Light Cyan Treatment

**Date:** 2026-06-18
**Site:** Dr. Scott Hannah — HugoBlox Academic CV
**Goal:** Make the site feel personally his, not an off-the-shelf template — without changing the theme or its structure.

## Audience

Broad / general: academics, students, the public, hirers, media. The common thread across all of them is *Scott himself*, so the design leans on a strong personal identity (authentic content + a distinctive, professional look) rather than optimizing for one niche.

## Direction (agreed)

**Bold + modern, on a light background, with a cyan accent.** Big, confident headings; airy layout; cyan used decisively on the name, links, buttons, interest chips, and publication years. Derived from comparing four directions visually — Scott chose "C (bold/modern) but on a light background," then confirmed cyan as the accent.

Note: `primary: cyan` already maps to **#0891b2** in the theme, so the accent hue is unchanged. The transformation comes from the **styling treatment** and **real content**, not a new colour.

## Constraints / Non-goals

- **No structural change.** The HugoBlox block model stays: `content/_index.md` keeps the same `sections:` blocks (`resume-biography-3`, `markdown`, the `collection` blocks, `cta-card`) in the same order. No blocks added, removed, or reordered. No "Research areas" section (the mockup's cards were illustrative only).
- **Stay in the theme.** Personalize via the theme's own knobs, not a fork.
- **No emojis, ever.** Use the HugoBlox icon framework (`hero/*`, `academicons/*`, `brands/*`, named icons like `at-symbol`).
- **No pixel-chasing the mockup.** The mockup is the target *feel*; styling is calibrated against the real rendered blocks.
- The earlier author-name fix, owner consolidation, demo-stub removal, and author-box toggle are already done and out of scope here.

## Implementation

Three levers, none of which touch block structure:

### 1. Theme settings — `config/_default/params.yaml`
- Keep `hugoblox.theme.colors.primary: cyan` (= #0891b2).
- Tune `typography` and `layout.radius` only if needed to support the bold-light feel (e.g. confirm `font: sans`; radius `md`). Minimal changes; validated live.

### 2. Custom styling — new `assets/css/custom.css`
The theme auto-loads this file. It carries the entire bold-light treatment, written against the theme's existing CSS variables (`--color-primary-*`) so it adapts to light/dark mode and stays cyan. It restyles the **existing** `resume-biography-3` and collection blocks — it adds no markup. Scope:
- **Name/heading** — larger, tighter tracking, heavier weight; cyan accent detail.
- **Avatar** — Scott's real photo (`assets/media/authors/me.jpeg`), styled per the look (rounded, soft shadow/ring). *Not* the gradient monogram from the mockup — that was a placeholder.
- **Interest chips** — pill/tag styling with a light cyan tint.
- **Buttons** (Download CV) and **links** — solid cyan / cyan accent with the agreed weight and radius.
- **Publication list** — cyan year + DOI accents in the `collection` citation view.
- **Section headings** — the small uppercase cyan label treatment.
- **Subtle background** — lean on the theme's existing `gradient_mesh` (already enabled, auto-tinted by the cyan primary) rather than new backgrounds.

### 3. Template overrides — only if required (fallback)
If a specific element can't be reached from `custom.css`, add a minimal local partial override under `layouts/` (same pattern already used for author names), with a header comment noting it's a local override and why. Prefer CSS; use overrides sparingly.

### Icons
Replace any placeholder/emoji iconography with framework icons: research/interest and section markers via `hero/*`; the CV button via `hero/arrow-down-tray`; social links via `academicons/*` and `brands/*` (already correct in `me.yaml`).

## Content cleanup (de-faking)

Editing content *inside* the existing blocks — no structure change. The current site contains template copy that contradicts Scott's real identity:

| Location | Placeholder now | Action |
|---|---|---|
| `content/_index.md` markdown block | "research scientist in the Moonshot team at DeepMind… machine learning… science and technology in the economy" | Rewrite as Scott's real research statement (cardiovascular & exercise physiology, bone health, clinical rehab, translational/data-driven), drafted from his bio + publications, for his review. |
| `me.yaml` → `awards` | "Best Paper Award, NeurIPS, 2022" (fake) | Remove. Re-add only real awards he supplies. |
| `me.yaml` → `skills` | Python / Machine Learning / Cloud Computing | Replace with real, method-based skills drawn from his work (e.g. arterial stiffness / pulse-wave analysis, cardiopulmonary exercise testing, bone/calcium assessment, R / statistical modelling) — drafted for his confirmation; levels his to adjust. |
| `me.yaml` → `languages` | English (Native), Spanish (Fluent) | Keep English; remove Spanish unless confirmed. |
| `me.yaml` → education button | "Download dissertation" → `/resume.pdf` (wrong target) | Fix target or remove the button. |
| `me.yaml` → `interests` | Mostly real already | Keep; light trim if desired. |
| Demo entries feeding homepage `collection` blocks — Talks (`content/events/example`), News (demo blog posts) | Template demo content | Remove the demo entries so nothing fake shows; the blocks remain and render real items as Scott adds them. |

## Content Scott will supply (not blockers for styling)

These need real data and are his to provide whenever ready — styling ships without them:
- Real talks/presentations (for the Talks block).
- Real awards/honours, if any.
- Confirm/adjust the drafted skills list and levels; confirm languages.
- Whether to keep a blog/writing presence (currently demo posts only) — decided separately.

## Verification

- Calibrate `custom.css` live with `hugo server` against the real blocks (not the mockup).
- Full `hugo` build passes with no errors; spot-check the homepage, a publication page, and dark mode.
- Confirm: no emojis rendered; icons resolve; cyan accent consistent; structure (blocks) unchanged vs. before.

## Out of scope

Restructuring or removing sections; a research-areas block; custom fonts beyond the theme's options; bug-hunting beyond what's listed; populating real talks/awards content.
