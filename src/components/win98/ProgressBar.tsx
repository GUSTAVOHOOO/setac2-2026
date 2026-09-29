/** Barra de progresso em blocos (porte de Setac.progress). Mostre sempre o número em texto ao lado. */
export function ProgressBar({
  value,
  label,
  onFace,
}: {
  /** 0–100 */
  value: number;
  /** Nome acessível (ex.: "Vagas preenchidas no Minicurso 1"). */
  label: string;
  onFace?: boolean;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={['w98-progress', onFace && 'on-face'].filter(Boolean).join(' ')}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${v}%` }} />
    </div>
  );
}
