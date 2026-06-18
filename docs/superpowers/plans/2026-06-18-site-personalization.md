# Site Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Dr. Scott Hannah's HugoBlox Academic CV feel personally his — bold + light, cyan accent, real content — without changing the theme or its block structure.

**Architecture:** Two phases. **Phase 1 (content)** edits content *inside* existing blocks to remove template/placeholder copy. **Phase 2 (styling)** adds a single `assets/css/custom.css` (auto-loaded by the theme) plus minimal `params.yaml` tuning, restyling the existing `resume-biography-3` and `collection` blocks via the theme's `--color-primary-*` variables. No blocks are added, removed, or reordered. No emojis — only the theme icon framework (`hero/*`, `academicons/*`, `brands/*`).

**Tech Stack:** Hugo (extended) v0.154 + HugoBlox `blox` module (Tailwind CSS v4), YAML content, `hugo server` for live calibration.

**Verification model (not unit tests):** each change is verified by (a) `hugo` build with no errors, (b) targeted `grep` of the rendered `public/` HTML, and (c) visual check via `hugo server` at http://localhost:1313. Commit after each task.

**Branch:** already on `feature/site-personalization`.

**Spec:** `docs/superpowers/specs/2026-06-18-site-personalization-design.md`

---

## Phase 1 — Content de-faking

### Task 1: Clean the owner profile (`data/authors/me.yaml`)

**Files:**
- Modify: `data/authors/me.yaml`

- [ ] **Step 1: Remove the emoji status icon**

Set the status icon to empty (do **not** delete the whole `status:` key — the theme's `resume-biography-3/block.html:84` dereferences `$profile.status.icon` unguarded and a missing `status` throws a nil-pointer build error). Empty string renders no badge:

```yaml
status:
  icon: ''  # No status badge (theme requires the key to exist; emoji removed)
```

- [ ] **Step 2: Remove the fake award**

Delete the entire `awards:` block (NeurIPS "Best Paper Award" is template filler). HugoBlox hides the awards section when absent. Real awards can be added back later.

```yaml
awards:
  - title: Best Paper Award
    awarder: NeurIPS
    date: "2022-12-01"
    summary: Awarded for groundbreaking work on efficient training of large models.
    icon: hero/trophy
```

- [ ] **Step 3: Replace the placeholder skills with real, method-based ones**

Replace the existing `skills:` block (Python / Machine Learning / Cloud Computing — wrong field) with skills drawn from Scott's actual published methods. **Levels are a first draft — Scott confirms/edits in Step (Task 7 review).**

```yaml
skills:
  - name: Research & Assessment
    items:
      - label: Arterial Stiffness & Pulse-Wave Analysis
        level: 5
      - label: Cardiopulmonary & Exercise Testing
        level: 5
      - label: Bone & Calcium Metabolism Assessment
        level: 4
  - name: Data & Communication
    items:
      - label: R & Statistical Modelling
        level: 4
      - label: Academic Writing
        level: 5
      - label: Conference Presentations
        level: 4
```

- [ ] **Step 4: Trim languages to what's real**

Remove the Spanish entry unless confirmed real; keep English. Result:

```yaml
languages:
  - name: English
    level: 5
    label: Native
```

- [ ] **Step 5: Fix the education button target**

In the PhD education entry, the "Download dissertation" button points at `/resume.pdf` (the CV, not a dissertation). Remove that `button:` block (cleaner than a misleading link); the CV download stays available from the hero.

```yaml
    button:
      text: Download dissertation
      url: /resume.pdf
      icon: hero/arrow-down-tray
```

- [ ] **Step 6: Build and verify**

Run: `hugo --gc --logLevel error`
Expected: exit 0, no errors.
Run: `grep -c "NeurIPS\|Machine Learning\|Cloud Computing\|Spanish" public/index.html`
Expected: `0`

- [ ] **Step 7: Commit**

```bash
git add data/authors/me.yaml
git commit -m "content: replace placeholder profile data with real details

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Rewrite the homepage research statement (`content/_index.md`)

**Files:**
- Modify: `content/_index.md` (the `block: markdown` titled "📚 My Research")

- [ ] **Step 1: Replace the block title (drop the emoji) and the placeholder text**

Find the markdown block currently containing "I'm a research scientist in the Moonshot team at DeepMind…". Replace its `title` and `text` with:

```yaml
  - block: markdown
    content:
      title: 'Research'
      subtitle: ''
      text: |-
        I'm a Senior Lecturer in Exercise Physiology at the University of Winchester, where I research how the body responds to exercise — spanning cardiovascular and vascular function, bone and calcium metabolism, and recovery — in both healthy and clinical populations.

        My work is applied and translational: I'm interested in turning physiological measurement into assessment that is reproducible and genuinely useful, from arterial stiffness and resistance-training responses to exercise rehabilitation.

        I lead the BSc (Hons) Sport and Exercise Science programme and supervise postgraduate research. I'm always glad to hear from prospective students and collaborators.
    design:
      columns: '1'
```

(Note: title was `'📚 My Research'` — the emoji is removed. Leave all other blocks in `sections:` untouched.)

- [ ] **Step 2: Build and verify the new copy is present and the old is gone**

Run: `hugo --gc --logLevel error` → exit 0
Run: `grep -c "DeepMind\|Moonshot\|science and technology in the economy" public/index.html` → Expected: `0`
Run: `grep -c "Senior Lecturer in Exercise Physiology at the University of Winchester" public/index.html` → Expected: `≥1`

- [ ] **Step 3: Commit**

```bash
git add content/_index.md
git commit -m "content: rewrite homepage research statement in Scott's voice

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Remove demo Talks and News content

**Files:**
- Delete: `content/events/example/` (demo talk feeding the Talks block)
- Delete: `content/blog/data-visualization/`, `content/blog/get-started/`, `content/blog/notebook-onboarding/`, `content/blog/project-management/`, `content/blog/second-brain/`, `content/blog/teach-courses/` (demo posts feeding the News block)

Keep `content/events/_index.md` and `content/blog/_index.md` — the sections/blocks stay; only the demo *entries* go. (Projects, Courses, Slides are out of scope for this plan — separate decision.)

- [ ] **Step 1: Remove the demo talk**

```bash
git rm -r content/events/example
```

- [ ] **Step 2: Remove the demo blog/news posts**

```bash
git rm -r content/blog/data-visualization content/blog/get-started content/blog/notebook-onboarding content/blog/project-management content/blog/second-brain content/blog/teach-courses
```

- [ ] **Step 3: Build and verify the homepage no longer shows demo items**

Run: `hugo --gc --logLevel error` → exit 0
Run: `grep -ci "Welcome to Hugo Blox\|example talk\|second brain" public/index.html` → Expected: `0`

- [ ] **Step 4: Commit**

```bash
git commit -m "content: remove demo talks and blog/news entries (blocks unchanged)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 2 — Styling (bold + light, cyan)

> Phase 2 is visual and iterative. Run `hugo server --disableFastRender` (http://localhost:1313) and keep it open; rebuild is automatic. After each task, **look at the homepage** and confirm the described effect before committing.
>
> **Reality check (verified against `blox/resume-biography-3/block.html`):** the theme already delivers most of the agreed look out of the box — a `font-black` name, the role in `text-primary-600` (cyan), interests already rendered as cyan pill chips (`bg-primary-50` / `text-primary-800` / `rounded-full`), and a bordered, shadowed avatar showing Scott's real photo. So `custom.css` stays **small**: the one genuine gap is the CV button (its `from-primary-600 to-secondary-600` gradient has no `secondary` set), plus optional accent polish. Do not re-implement what the theme already does. Most of the "make it mine" value is Phase 1 (content).

### Task 4: Create `assets/css/custom.css` and confirm it loads

**Files:**
- Create: `assets/css/custom.css`

- [ ] **Step 1: Create the file with the base layer**

```css
/* Custom styling for Dr. Scott Hannah's HugoBlox Academic CV.
   Direction: bold + light, cyan accent. Restyles EXISTING blocks only — adds no markup.
   Uses the theme's --color-primary-* variables so it stays on-theme and adapts to dark mode.
   Theme reference: blox resume-biography-3 uses .resume-biography, .avatar, .bio-text. */

/* A sentinel so we can verify the file is loaded in the built HTML. */
:root { --shannah-custom-css: 1; }
```

- [ ] **Step 2: Build and verify the theme picked up custom.css**

Run: `hugo --gc --logLevel error` → exit 0
Run: `grep -c "css/custom" public/index.html`
Expected: `≥1` (the theme fingerprints and links `assets/css/custom.css` from `site_head.html`).

- [ ] **Step 3: Commit**

```bash
git add assets/css/custom.css
git commit -m "style: add custom.css scaffold (auto-loaded by theme)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Fix the hero "Download CV" button

**Files:**
- Modify: `assets/css/custom.css`

The block's button uses Tailwind `from-primary-600 to-secondary-600`, but `secondary` is unset in `params.yaml`, so the gradient half is undefined. Make it a confident solid cyan (simplest, fully in CSS). *(Alternative, if Scott wants the gradient: set a complementary `hugoblox.theme.colors.secondary` such as `blue` in `params.yaml` — note it during the Task 7 review.)*

- [ ] **Step 1: Confirm the button selector**

Run: `grep -o '<a[^>]*from-primary-600[^>]*>' public/index.html | head -1`
Expected: a link with classes including `bg-gradient-to-r from-primary-600 to-secondary-600`. Confirms the selector below matches.

- [ ] **Step 2: Add the solid-cyan override**

Append to `assets/css/custom.css`:

```css
/* Hero "Download CV" button — solid, confident cyan (secondary colour is unset). */
.resume-biography a[class*="from-primary-600"] {
  background-image: none !important;
  background-color: var(--color-primary-600) !important;
  border-radius: 0.7rem;
}
.resume-biography a[class*="from-primary-600"]:hover {
  background-color: var(--color-primary-700) !important;
}
```

- [ ] **Step 3: Build and view**

Run: `hugo --gc --logLevel error` → exit 0
View http://localhost:1313 — the Download CV button is a clean solid cyan (no half-empty gradient), with hover darkening.

- [ ] **Step 4: Commit**

```bash
git add assets/css/custom.css
git commit -m "style: solid cyan Download CV button

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Optional accent polish (only if the live view calls for it)

**Files:**
- Modify: `assets/css/custom.css`

The theme already accents most links with the primary colour. Only add rules here for gaps the live homepage actually shows — do not pre-emptively restyle. Candidate, if publication links/years look flat:

- [ ] **Step 1: View the Recent Publications block on the live site**

At http://localhost:1313, scroll to Recent Publications. If links/DOIs already read cyan (likely — the theme uses `text-primary-*`), **skip this task** and move to Task 7.

- [ ] **Step 2 (only if needed): add a minimal citation-link accent**

First confirm the real class: `grep -oE 'class="[^"]*(citation|cite)[^"]*"' public/publications/index.html | sort -u | head`. Then append a rule scoped to that class, e.g.:

```css
/* Only if publication links render flat — scope to the confirmed citation class. */
.article-style a, .citation a { color: var(--color-primary-700); font-weight: 600; }
```

- [ ] **Step 3: Build, view, commit (if changed)**

Run: `hugo --gc --logLevel error` → exit 0; view the page.
```bash
git add assets/css/custom.css
git commit -m "style: minor publication-link accent

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Calibrate overall feel + params, then Scott's review

**Files:**
- Modify: `assets/css/custom.css`, `config/_default/params.yaml`

- [ ] **Step 1: Confirm theme knobs in `params.yaml`**

Ensure (no change expected to colour — already cyan):
```yaml
  theme:
    colors:
      primary: cyan
  typography:
    font: sans
  layout:
    radius: md
```
If the bio feels cramped, try `spacing: comfortable` (already set). Only change what the live view shows is needed.

- [ ] **Step 2: Optional light-background polish**

If the hero feels flat, lean on the existing gradient mesh (already enabled in `content/_index.md`). Only if needed, add a gentle section rhythm:

```css
/* Slightly tighter, more confident hero name on large screens */
.resume-biography h1 { letter-spacing: -0.02em; }
```

- [ ] **Step 3: Full verification pass**

Run: `rm -rf public resources/_gen && hugo --gc --logLevel error` → exit 0
- No emojis rendered (Python avoids the unicode-regex grep failures seen earlier):
  ```bash
  python3 - <<'PY'
  import glob, re
  emoji = re.compile('[\U0001F300-\U0001FAFF☀-➿⬀-⯿️]')
  hits = [f for f in glob.glob('public/**/*.html', recursive=True) if emoji.search(open(f, encoding='utf-8', errors='ignore').read())]
  print('FILES WITH EMOJI:', hits or 'none')
  PY
  ```
  Expected: `FILES WITH EMOJI: none`
- Structure unchanged: homepage still has bio, publications, talks, news blocks in order (visual check).
- Dark mode: toggle the theme switch on the live site; cyan + chips still legible.

- [ ] **Step 4: Scott reviews the live site**

Show Scott `hugo server` (http://localhost:1313). Confirm: the look matches the agreed bold-light cyan direction; the **skills labels/levels (Task 1) are accurate** — edit `me.yaml` with his corrections; copy reads right. Make any requested tweaks, rebuild, and confirm.

- [ ] **Step 5: Commit**

```bash
git add assets/css/custom.css config/_default/params.yaml data/authors/me.yaml
git commit -m "style: final bold-light cyan calibration; confirm profile content

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Follow-ups (not in this plan)

- Real talks, awards, and any blog/writing content for Scott to supply over time.
- Decision on the demo Projects / Courses / Slides sections (kept as-is for now per scope).
- Opening a PR for `feature/site-personalization` when Scott is ready.
