# About section rewrite — brief for a fresh session

**Date:** 2026-06-29
**Task:** Rewrite the *copy* of the homepage About section. The structure, motion, and
visual design are built and approved. What is not yet right is the words, mainly the
philosophy / lede paragraph, and optionally the four facet descriptors. The goal is an
award-grade personal "About" that genuinely captures Scott.

Read this whole file before writing anything. The point of it is to stop the new session
repeating a long, painful loop from the previous one.

## File

`src/components/About.astro` (homepage section, `id="about"`). It sits directly after the
generative hero.

## Current built state (treat as locked unless the copy genuinely needs a change)

- **Direction:** "identity statement" (chosen over two alternatives: an "annotated subject"
  data-portrait, and a career "timeline").
- **Layout:** a bold declaration headline, then a philosophy lede paragraph, alongside a
  framed duotone portrait (teal corner registration mark + a faint measurement tick-scale
  beneath it), a name/role caption, and a four-facet grid below.
- **Declaration (the H2, approved, do not casually change):** "I measure. I teach. I translate."
  The three full stops are teal (echoing the wordmark's teal period), and there is a bespoke
  GSAP entrance whose signature beat is each period landing like a plotted point. The motion
  is reduced-motion safe and verified. Changing the declaration text means reworking that motion.
- **Facets (4):** Researcher / Educator / Practitioner / Analyst, each a title + one short
  descriptor. The facets carry the *specifics*, so the lede must NOT also list roles or topics.
  Note: the Analyst descriptor currently contains a cliché ("finding the signal in the
  measurement") that should be replaced. His notes suit these well (see below).
- **Portrait:** the current photo is a casual snapshot, duotoned and cropped to a face. A proper
  art-directed headshot is the single biggest pending uplift and is Scott's to supply. Do not
  redesign around the photo; just drop a better one in when it arrives.

## The line being replaced

Currently committed lede (Scott finds it too thin / "too small" and wants more of *him*):

> Ten years measuring how the body works and adapts, from the laboratory to the clinic to the field.

He wants a few sentences of genuine philosophy + experience here, not a one-liner of scope.

## Who Scott is — context to UNDERSTAND, never to quote

He is an exercise physiologist, roughly ten years in, driven first by curiosity about how the
body works at the whole-body and systems level. He values basic science for its own sake **and**
applied science; he holds them as equals and does not rank usefulness above understanding. He
moves across the laboratory, the clinic, and elite sport, and across pure and applied work,
without treating them as separate jobs. His sharpest point of view is that exercise is medicine
in the proper sense: not the slogan that "movement is good for you", but understanding and
prescribing it with the seriousness given to a drug. He is an educator (Programme Leader, PhD
supervisor) who wants to spark curiosity in students, a data and statistics person who also
builds apps, and someone interested in communicating science through design (the site itself is
that, so it does not need stating).

His own raw notes, provided ONLY so the writer understands him. **Do not reassemble these into
prose; that was the previous session's mistake.** Synthesise; do not transcribe:

> I am a physiologist interested in understanding how the body works, from cells to whole body
> organisms / systems. Bench top to Translating to applied physiology for actionable change.
> Interrogating data statistically. Curious. I am an educator who trys to inspire and invoke
> curiosity in my students. Experienced lecturer and researcher. Applied practitioner supporting
> athletes. Advocate for exercise as medicine (clinical exercise physiology) - not just exercise
> is good but understanding the molecular benefits like medicine. Communicating science through
> design. Worked at a range of HE institutions and a range of professional sports people as well
> as clinical populations. 10 years of experience. Programme leader in sport and exercise science.
> PhD supervisor. App developer and data science geek.

### Two corrections he made to those notes (important, do not get these wrong)

1. **He does NOT do cell or molecular / bench work, and his research does not show it.** Do not
   imply cellular, molecular, or bench science. His work is whole-body, systems, and applied.
   The exercise-as-medicine point is about understanding and prescribing, not molecular research.
2. **He values basic science for its own sake.** Do NOT write that science is only worthwhile if
   it can be acted on. He enjoys fundamental work; basic and applied carry equal weight.

## What this section must do

1. Put a credible, real human behind the hero (the hero is concept; this is the person).
2. Make a fellow researcher AND a coach or clinician both think "this is someone I'd want to work
   with", from one piece of writing.
3. Show what he *believes*, not just what he does. The point of view is the differentiator.
4. Earn authority through how it reads, not through claims or a credentials list.

## What "excellent" looks like (the bar)

Excellent personal About copy takes a clear position, sounds like one particular human and nobody
else, leaves the facts to the rest of the site, and lets you feel *why* the person does the work.
Specific and opinionated beats comprehensive and smooth. It is distilled: it says a lot in a
little and trusts the reader. Curiosity is Scott's natural spine; exercise-as-medicine is his
sharpest belief.

## Hard constraints and voice

- Voice: confident, precise, human; states a point of view; never boastful (he is early-to-mid
  career and dislikes over-claiming). Quality over quantity; do not count papers.
- No em dashes anywhere in copy (use commas, colons, full stops). No emojis. British spelling.
- "Dr" before the name, no full stop (matches the rest of the site). No "University of Winchester"
  in identity framing (the site is about him; his email is the only allowed Winchester reference).
- Do not anchor his identity on "effort"; it is a small part of his research.
- See also the memory notes: avoid-ai-tells, brand-not-cv, spectacle-earned-not-gimmicky,
  no-em-dashes-front-facing, no-emojis.

## AI-tell phrasings he explicitly rejected (do not reach for these)

- "the gap between rigorous science and real practice" (abstract balanced dyad)
- "physiology measured to the millisecond becomes decisions" (grand vague transformation)
- "signal in the noise"
- Reassembling his bullet-point notes into a list-like paragraph
- Anything that reads as smooth, generic, or generated rather than a specific person talking.
  Use concrete nouns, plain verbs, and one clear opinion.

## For reference only: the last attempt (do NOT just reuse it; he had not approved it)

> I have spent ten years trying to understand how the body works, and much of it ignoring the
> lines other people draw around the question. I move between the laboratory, the clinic, and
> elite sport, and between science done for its own sake and science that has to be useful,
> because I have never found those to be different jobs. If there is a thread, it is that I take
> exercise as seriously as medicine, and the body as seriously as it deserves.

This was heading in a better direction (an angle: he refuses the usual divisions), but treat it as
a data point, not a starting draft. Consider proposing one strong, fully-formed piece with a clear
governing idea rather than a menu of options; he found repeated option-menus and verbatim
note-echoing frustrating.

## Suggested way to open the new session

Brainstorm the *angle* first (one governing idea for the section), agree it, then write one
distilled piece to it. Verify visually in the browser (the section's reveal is triggered by
IntersectionObserver, which does not re-fire on programmatic scroll in the preview tool, so
trigger it by collapsing the hero, e.g. set `.gh` display:none, or reload with the About in view).
