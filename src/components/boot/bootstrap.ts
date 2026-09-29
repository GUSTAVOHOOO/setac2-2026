/** Runs before the body paints; a failed/disabled script always leaves the site usable. */
export const BOOT_SESSION_KEY = 'setac2:boot-seen';

export const bootBootstrap = `(() => {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try { if (sessionStorage.getItem('${BOOT_SESSION_KEY}')) return; } catch {}
    document.documentElement.dataset.boot = 'pending';
    window.setTimeout(() => {
      delete document.documentElement.dataset.boot;
      window.dispatchEvent(new Event('setac:boot-timeout'));
    }, 8000);
  } catch {}
})();`;
