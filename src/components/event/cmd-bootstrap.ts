/**
 * Script do <head>: antes da primeira pintura marca o <html> para o CSS esconder a saída do CMD
 * (sem o "pisca" do texto pronto antes de ser digitado). Se o JS falhar, o texto volta sozinho.
 */
export const cmdBootstrap = `(() => {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = document.documentElement;
    r.dataset.cmdType = '';
    setTimeout(() => { delete r.dataset.cmdType; }, 12000);
  } catch {}
})();`;
