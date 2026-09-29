/** Letreiro rolando (`.web-marquee`), preto e dourado. CAIXA ALTA permitida. Para com reduced-motion. */
export function Marquee({ children }: { children: string }) {
  return (
    <div className="web-marquee" role="marquee" aria-label={children}>
      <span aria-hidden="true">{children}</span>
    </div>
  );
}
