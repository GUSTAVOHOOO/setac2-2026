# Desktop repaint after boot

User requested implementation of a period-inspired entrance for homepage components using
an animation library. The existing approved boot and once-per-session behavior remain.

## Design

Anime.js v4 timeline: taskbar paint (120ms), icons at 55ms intervals, caption outlines moving
from the taskbar to window titles in six discrete steps (200ms), then window paint (110ms).
Other homepage regions paint last. Total desktop entrance: 1.1 seconds after the 4.8-second boot.
This is a web adaptation of classic caption animation, not a claim that Win98 choreographed
all desktop icons this way at startup. No elastic movement, transparent fades or scaling text.

## Implementation and checks

- [x] Research original behavior and compare official Anime.js / GSAP documentation.
- [x] Confirm browser acceptance test fails: after the splash there is no desktop reveal yet.
- [x] Add Anime.js dependency; isolate timeline and cleanup in `revealDesktop.ts`.
- [x] Trigger only on automatic boot completion, before closing the dialog to avoid a flash.
- [x] Reveal instantly on interaction, resize, reduced motion, visibility change or watchdog.
- [x] Verify stages, cleanup, skip/reload/reduced-motion bypass, mobile and direct-route windows.
- [x] Run lint, typecheck and build; inspect intermediate screenshots; update README/research.

## Verification

Chrome/Playwright at 1600×900 and 360×800: staged taskbar/icons, caption outline, window
paint, completion at ~1.1s, no residual clip/inert/ghost elements, reload suppression,
initial/mid-animation reduced motion, skip and Escape, interaction (Start opens on the
first click), resize cleanup, direct programacao route and subsequent app navigation all passed.
Screenshots of intermediate stages were inspected; completed masks are removed individually
to preserve overflowing icon labels and window shadows. No browser page errors.
`npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` passed.
