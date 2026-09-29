/**
 * Contador de visitas (porte de Setac.counter): dígitos com zeros à esquerda.
 * É decorativo: o site é estático e não conta visitas de verdade.
 */
export function VisitCounter({ n, digits = 6 }: { n: number; digits?: number }) {
  const s = String(n).padStart(digits, '0');
  return (
    <span className="web-counter" role="img" aria-label={`${n} visitas`}>
      {s.split('').map((c, i) => (
        <span key={i}>{c}</span>
      ))}
    </span>
  );
}
