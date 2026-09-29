# Windows 98 boot — implementation plan

**Goal:** implement the approved 4.8-second Windows 98 intro, once per tab session.

**Architecture:** persistent client component in the root layout, native modal dialog for focus isolation, local logo asset, and dedicated CSS. A small pre-paint script checks session storage and reduced motion; without JavaScript the site remains accessible. Existing desktop navigation continues underneath.

**Stack:** existing Next.js 16 / React 19 / TypeScript / design-system tokens and Button.

## Approved constraints

- User explicitly requests the Windows 98 logo in the boot splash, overriding the design-system brand restriction for this screen only.
- POST 0–1.2s, DOS 1.2–1.8s, Windows splash 1.8–4.3s, teal desktop transition 4.3–4.8s.
- Skip button and Escape; silent; reduced motion bypasses intro; no fake download percentage.
- Session storage errors must never prevent entry. No changes to event data or window management.

## Tasks

- [x] Obtain local Windows 98 logo and record provenance in `public/boot/README.md`.
- [x] Verify a browser acceptance check fails before implementation: a fresh session must show the boot dialog.
- [x] Add `src/components/boot/BootScreen.tsx`, `src/components/boot/bootstrap.ts`, and `src/styles/boot.css`; integrate in `src/app/layout.tsx`.
- [x] Verify all four phases, automatic finish, reload suppression, Escape/click skip, keyboard isolation, reduced motion, blocked storage, no-JavaScript access, mobile overflow and direct route preservation in a real browser.
- [x] Run lint, TypeScript and production build; inspect desktop/mobile splash screenshots. Update research and README to match delivered behavior.

Existing workspace contains the user's uncommitted site; edits remain here without committing unrelated work.

## Verification — 2026-09-29

`npm run lint`, `npm run typecheck`, and `npm run build` passed. Browser checks used
Playwright with local Chrome at 1280×800 and 360×800. All scenarios above passed without
page errors. Captures of POST and both splash sizes were inspected. Native dialog keeps
the underlying site inert; Tab can still reach browser chrome, which is expected.
The hydration-failure watchdog and changing reduced-motion preference during boot also passed.
