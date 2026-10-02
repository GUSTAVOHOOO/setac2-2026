export const CRT_STORAGE_KEY = 'setac2:crt';

export const crtBootstrap = `(() => {
  let value = 'on';
  try {
    if (localStorage.getItem('${CRT_STORAGE_KEY}') === 'off') value = 'off';
  } catch {}
  document.documentElement.dataset.crt = value;
})();`;
