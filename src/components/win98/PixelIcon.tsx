import type { ImgHTMLAttributes } from 'react';

interface PixelIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Caminho em /public (ex.: '/icons/megafone.svg'). */
  src: string;
  /** Vazio quando o ícone é decorativo (o padrão). */
  alt?: string;
  size?: 16 | 20 | 24 | 32;
}

/**
 * Ícone pixel 16×16 (SVG) com `image-rendering: pixelated`.
 * Usa <img> simples de propósito: SVGs minúsculos não ganham nada com next/image.
 */
export function PixelIcon({ src, alt = '', size = 16, className, ...rest }: PixelIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={['pixel', className].filter(Boolean).join(' ')}
      decoding="async"
      {...rest}
    />
  );
}
