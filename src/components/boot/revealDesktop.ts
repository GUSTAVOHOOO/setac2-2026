import { createTimeline, steps } from 'animejs';

/** A short Win9x-inspired repaint, only after the first uninterrupted boot. */
export function revealDesktop(): () => void {
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!document.querySelector('.site-home') || motion.matches || document.hidden) return () => {};

  const collect = (selector: string) =>
    Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  const taskbar = collect('.site-bottom');
  const icons = collect('.site-home .w98-icongrid > .w98-icon');
  const windows = collect('.site-windows > .w98-window, .os-layer > .os-frame:not([hidden])');
  const extras = collect('.site-home > .web-marquee, .site-hero-ctas, .site-home > .site-web');
  const targets = [...taskbar, ...icons, ...windows, ...extras];
  const originals = targets.map((el) => ({
    el,
    clip: el.style.getPropertyValue('clip-path'),
    priority: el.style.getPropertyPriority('clip-path'),
    inert: el.inert,
  }));
  const ghosts: HTMLDivElement[] = [];
  let timeline: ReturnType<typeof createTimeline> | undefined;
  let watchdog: number | undefined;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(watchdog);
    timeline?.cancel();
    for (const { el, clip, priority, inert } of originals) {
      if (clip) el.style.setProperty('clip-path', clip, priority);
      else el.style.removeProperty('clip-path');
      delete el.dataset.bootReveal;
      el.inert = inert;
    }
    ghosts.forEach((ghost) => ghost.remove());
    delete root.dataset.desktopReveal;
    window.removeEventListener('pointerdown', finish, true);
    window.removeEventListener('keydown', finish, true);
    window.removeEventListener('wheel', finish, true);
    window.removeEventListener('resize', finish);
    document.removeEventListener('visibilitychange', finish);
    motion.removeEventListener('change', finish);
  };

  try {
    root.dataset.desktopReveal = 'running';
    originals.forEach(({ el }) => {
      el.dataset.bootReveal = 'waiting';
      el.inert = true;
    });
    timeline = createTimeline({ autoplay: false, onComplete: finish });
    const paint = (el: HTMLElement, at: number, duration = 100) => {
      timeline!.call(() => {
        el.dataset.bootReveal = 'painting';
      }, at);
      timeline!.add(
        el,
        {
          clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
          duration,
          ease: steps(4),
        },
        at,
      );
      timeline!.call(() => {
        // Painted controls can already be used; their first click also finishes the entrance.
        const original = originals.find((item) => item.el === el);
        el.inert = original?.inert ?? false;
        // Remove each completed paint mask immediately (labels/shadows may overflow their box).
        if (original?.clip) el.style.setProperty('clip-path', original.clip, original.priority);
        else el.style.removeProperty('clip-path');
      }, at + duration);
    };

    taskbar.forEach((el) => paint(el, 0, 120));
    icons.forEach((el, index) => paint(el, 120 + index * 55, 65));

    windows.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const at = 360 + Math.min(index, 3) * 160;
      // Animate a separate caption outline, never the draggable window's transform/position.
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const ghost = document.createElement('div');
        ghost.className = 'boot-caption-outline';
        ghost.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ghost);
        ghosts.push(ghost);
        timeline!.call(() => {
          ghost.style.visibility = 'visible';
        }, at);
        timeline!.add(
          ghost,
          {
            left: [24, Math.round(rect.left)],
            top: [window.innerHeight - 28, Math.round(rect.top)],
            width: [96, Math.round(rect.width)],
            duration: 200,
            ease: steps(6),
          },
          at,
        );
        timeline!.call(() => {
          ghost.style.visibility = 'hidden';
        }, at + 200);
      }
      paint(el, at + 200, 110);
    });
    extras.forEach((el, index) => paint(el, 720 + index * 70, 100));
    // A bounded tail gives even a sparse desktop the same short cadence.
    timeline.add({ duration: 1100 }, 0);
    watchdog = window.setTimeout(finish, 1600);
    // Interaction immediately completes the decoration before the user's action runs.
    window.addEventListener('pointerdown', finish, true);
    window.addEventListener('keydown', finish, true);
    window.addEventListener('wheel', finish, { capture: true, passive: true });
    window.addEventListener('resize', finish);
    document.addEventListener('visibilitychange', finish);
    motion.addEventListener('change', finish);
    timeline.play();
  } catch {
    // A decorative animation must never leave event links or windows hidden.
    finish();
  }
  return finish;
}
