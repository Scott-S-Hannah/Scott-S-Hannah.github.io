# Dr Scott Hannah — Personal Brand Site (Astro Rebuild)

**Date:** 2026-06-18
**Supersedes:** the HugoBlox personalization spec (`2026-06-18-site-personalization-design.md`) and its plan. We are no longer styling the template; we are building a new site.

## Goal

Build a high-end personal brand site for Dr Scott Hannah that positions him as an authority in exercise and clinical physiology **through the quality of the design itself**, not by enumerating credentials. It should feel like a considered, premium brand, not an academic CV. Award-level craft: confident typography, art direction, restraint, and polish.

## Audience

Two primary audiences, served by one idea:
- **Academic peers and PhD prospects** — collaborators, grant panels, postgraduates. Want research depth and credibility.
- **Industry and clinical** — elite sport, clinicians, sports organisations. Want applied, translational credibility.

The unifying brand idea is the **bridge between lab-grade physiology and applied practice**: the same person who measures arterial stiffness to the millisecond also tests elite dancers and athletes and builds NHS stroke rehabilitation. This duality is the differentiator and addresses both audiences at once.

## Why a fresh build (not HugoBlox)

HugoBlox is an academic-CV framework. Its blocks, publication engine, and conventions all push toward "list my scholarly outputs," which is why every design that fit the template read as a CV. A genuine brand needs design freedom the template actively resists. Building fresh removes that friction entirely. Netlify hosts any stack, so hosting is not a constraint, and the current site stays live until cutover.

## Brand strategy

- **Positioning (working line, to finalise):** *The physiology of effort, performance, and recovery.* Scott measures how the body responds to exercise and inactivity, and translates it into assessment for elite performance and clinical care.
- **Voice:** confident, precise, human. States a point of view; never boastful about volume.
- **Authority model:** quality over quantity. Name the calibre of journals and the reality of applied work; do not count papers or lean on eminence/volume framing (Scott is early-to-mid career and finds that over-claiming). Credentials support the brand quietly; they are not the pitch.

## Design system

- **Typography:** a bold geometric sans for display and headlines (Sora), set tight with negative tracking for confidence; a clean neutral sans for body (Inter or comparable); a monospace for data and small metadata (years, units, journal codes). Self-hosted via @fontsource for performance and privacy. Not editorial/serif, by Scott's preference: the geometric sans reads modern and self-assured rather than academic.
- **Colour:** warm paper background, deep warm ink for text, one confident teal accent used decisively (links, primary CTA, an accent section), plus a deep-ink feature band for contrast moments. Light theme is the default identity. A dark mode is optional and deferred (not in the first phase).
- **Layout:** generous whitespace, a disciplined editorial grid, fine hairline rules, numbered section markers, small-caps/tracked labels.
- **Art direction:** the portrait is a hero asset, treated (refined crop, subtle duotone or warm monochrome), not a snapshot. Imagery is sparing and high quality.
- **Motion:** tasteful and restrained. Quiet reveal-on-scroll, gentle hover states, no parallax gimmicks or autoplay spectacle. Motion must respect `prefers-reduced-motion`.
- **Iconography:** minimal. A lightweight outline icon set (e.g. Lucide/Tabler as inline SVG) only where it earns its place. No emojis, ever.

## Information architecture (multi-page, phased)

**Phase 1 (core):**
- **Home** — the brand narrative (see section breakdown below).
- **Publications** — the full record migrated from `publications.bib`. Clean, scannable, filterable by year and theme. Each entry: title, authors (Scott emphasised), journal, year, type, DOI link. Optional per-publication detail pages deferred unless wanted.

**Phase 2:**
- **Research** — the focus areas expanded into the finer themes (arterial stiffness and resistance training; sedentary behaviour and vascular health; bone, calcium and hypoxia; clinical exercise rehabilitation; athlete health and RED-S), current projects, PhD supervision, and a narrative "how I measure" treatment of the methods (cfPWV, pulse-wave analysis, CPET/VO2max, lactate threshold, NIRS, point-of-care blood, blood-flow restriction, mixed-effects modelling) woven into prose rather than shown as a tag strip.
- **About / CV** — bio, career path, credentials (FHEA, The Physiological Society, Programme Leader), and a downloadable CV.
- **Contact** — collaborate / consult / study, with email and scholarly links.

Global nav (kept lean): Work/Research, Publications, About, Contact, plus a quiet "Get in touch" action. The current HugoBlox nav items Projects and Courses (template demo content) are dropped entirely.

## Homepage section-by-section (Phase 1)

Baseline is the approved brand direction; exact visuals are refined live during the build.

1. **Statement hero.** A point-of-view serif headline (the positioning line), a one-sentence support, the art-directed portrait, a small kicker identifying Scott, and two actions (primary "Explore the work", secondary "Read the research"). The name lives as the wordmark in the nav; the headline carries the hero.
2. **Manifesto / approach.** A single large display statement (Sora) of how Scott thinks about the work, on a deep-ink feature band for contrast. Example to refine: "Good physiology isn't about collecting more data. It's about the right measurement, at the right moment, made to matter."
3. **Areas of focus.** Three numbered brand pillars (Cardiovascular and vascular physiology; Clinical exercise rehabilitation; Applied performance physiology), each a line of editorial copy. Not a labelled theme-card grid.
4. **Selected work.** One featured flagship piece plus two supporting, pulled from the publications data and framed by the finding, not the citation count. Links through to the Publications page.
5. **Trusted by.** A confident, understated trust strip of applied partners (English National Ballet, Saracens, Queens Park Rangers, Marathon des Sables, NHS), pending name confirmation.
6. **Contact call to action.** A strong closing accent section: "Let's work together," email action, and a single quiet credentials line (FHEA, The Physiological Society, University of Winchester) as support.

No credential chip-bands, no methods-tag strips, no publication-count stat bands anywhere.

## Content plan

- **Migrate** `publications.bib` (17 entries) into an Astro content collection or typed data file at build time. Preserve title, authors, journal, year, month, type (article/conference/review), DOI, and abstract. Authors render with Scott emphasised.
- **Reuse** the portrait (`assets/media/authors/me.jpeg`) as a placeholder and the research/bio copy already drafted, rewritten into brand voice.
- **Real, verifiable substance** to draw on (from the record and the Winchester profile): journals (Journal of Cellular Physiology, PLoS ONE, Journal of Clinical Hypertension, Clinical Rehabilitation, European Journal of Sport Science, Physiological Reports, Sports Health); FHEA; Full Member of The Physiological Society; Programme Leader, BSc (Hons) Sport and Exercise Science; PhD (Ulster), MSc (Middlesex), BSc (Suffolk); WinWell consultancy and applied-sport clients; PhD supervision across stroke/robotic gait, Long COVID/sedentary vascular health, and resistance training/arterial stiffness.
- **No invented metrics.** Anything sourced from the web is confirmed with Scott before publishing.

## Technical architecture

- **Framework:** Astro (latest), static output (`output: 'static'`).
- **Content:** Astro content collections; a small build-time script converts `publications.bib` to collection entries or a typed JSON data file (using a maintained BibTeX parser). Citation/format logic lives in templates so presentation is fully controlled.
- **Styling:** token-based CSS using custom properties for the design system (type scale, colour, spacing, radius), for precise editorial control. A light utility layer is acceptable; a heavy CSS framework is not required. (Tailwind is an option if Scott prefers it; default is tokens + component-scoped CSS.)
- **Fonts:** self-hosted via @fontsource (Fraunces + Inter + a mono).
- **Motion:** minimal JS, Intersection Observer or CSS for reveals; honours `prefers-reduced-motion`.
- **SEO/sharing:** semantic HTML, per-page meta, Open Graph tags, `@astrojs/sitemap`, RSS optional later.
- **Accessibility:** WCAG AA targets — colour contrast, focus states, keyboard nav, alt text, reduced motion.
- **Repo and deploy:** reuse the existing GitHub repo (decided). First tag the current Hugo state (e.g. `hugo-site-final`) as a recoverable archive. Develop Astro on a new branch, with a local git worktree so both stacks can coexist in separate folders during the transition. Restructure for Astro (remove Hugo-specific files, keep `publications.bib`, media, and `docs/`). `main` keeps serving the live Hugo site throughout; review the Astro branch via Netlify branch-deploy previews. Cut over by merging the branch into `main` once approved, at which point Netlify rebuilds with `astro build` (publish `dist/`). Domain (`scott-hannah.com`), DNS, the Netlify connection, and the git history are all unchanged.

## Constraints and non-goals

- Stay static and Netlify-hosted; no server runtime, CMS, or database in this scope.
- No emojis. No em dashes in front-facing copy (use commas/periods).
- Phase 1 ships Home + Publications. Research, About/CV, and Contact follow in Phase 2.
- Dark mode, per-publication detail pages, a blog/writing section, and on-site search are out of scope for now (revisit later).
- No invented data or metrics.

## Open items and dependencies (not blockers for speccing the build)

- **Portrait.** A professional, well-lit portrait is the single biggest uplift. Build proceeds on the current photo; Scott swaps it when ready.
- **Client names.** Confirm which applied partners can be named publicly on the trust strip.
- **Positioning words.** Finalise the hero headline and manifesto wording with Scott.
- **Font licences.** Sora and Inter are both open-licensed (SIL Open Font License) and freely self-hostable. Body pairing (Inter or a comparable neutral sans) to confirm on review.

## Verification

- `astro build` passes with no errors; site previews on a Netlify branch deploy.
- All 17 publications render correctly from the migrated data, with working DOI links and correct author emphasis.
- Lighthouse: high scores across performance, accessibility, best practices, SEO (performance is itself a brand signal).
- Manual review: no CV patterns present; brand voice consistent; no emojis; no em dashes in copy; teal accent used with restraint; reduced-motion respected.
- Production cutover only after Scott approves the branch preview.

## Rough build order

1. Scaffold Astro project on a new branch; set up design tokens, fonts, base layout, and Netlify branch deploy.
2. Build the publications data pipeline (`.bib` to content) and the Publications page.
3. Build the Home page sections against real content.
4. Polish: motion, responsive behaviour, accessibility, meta/OG, performance pass.
5. Review preview with Scott; iterate; cut over Netlify production.
6. Phase 2: Research, About/CV, Contact.
