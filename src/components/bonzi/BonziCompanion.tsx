'use client';

import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBonzi } from './useBonzi';

export interface BonziProps {
  greeting: number;
  onClose: (restoreFocus: boolean) => void;
}

export default function BonziCompanion({ greeting, onClose }: BonziProps) {
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [bubbleHovered, setBubbleHovered] = useState(false);
  const [bubbleFocused, setBubbleFocused] = useState(false);
  const done = useCallback(
    () => onClose(!!root.current?.contains(document.activeElement)),
    [onClose],
  );
  const { snapshot, paused, togglePause, speak, leave } = useBonzi(
    greeting,
    hovered || focused,
    bubbleHovered || bubbleFocused,
    done,
  );
  const leaving = snapshot.state === 'leaving';

  return createPortal(
    <section
      ref={root}
      className="bonzi-companion"
      aria-label="BonziBuddy"
      data-state={snapshot.state}
      data-paused={paused}
      data-frame={snapshot.frame}
      data-direction={snapshot.direction}
      style={{ transform: `translate3d(${snapshot.x}px, ${snapshot.y}px, 0)` }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="bonzi-bubble-slot">
        {snapshot.text && (
          <p
            className="bonzi-bubble"
            tabIndex={0}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setBubbleHovered(true);
            }}
            onPointerLeave={() => setBubbleHovered(false)}
            onFocus={() => setBubbleFocused(true)}
            onBlur={() => setBubbleFocused(false)}
          >
            {snapshot.text}
          </p>
        )}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {snapshot.announced ? snapshot.text : ''}
      </span>
      <button
        className="bonzi-character"
        type="button"
        aria-label="Conversar com Bonzi"
        aria-disabled={leaving}
        onClick={() => {
          if (!leaving) speak();
        }}
      >
        <span
          className="bonzi-sprite"
          aria-hidden="true"
          style={{
            backgroundPosition: `${-(snapshot.frame % 17) * 200}px ${-Math.floor(snapshot.frame / 17) * 160}px`,
          }}
        />
      </button>
      <div className="bonzi-controls">
        <button
          type="button"
          aria-disabled={leaving}
          onClick={() => {
            if (!leaving) togglePause();
          }}
        >
          {paused ? 'Continuar' : 'Pausar'}
        </button>
        <button
          type="button"
          aria-disabled={leaving}
          onClick={() => {
            if (!leaving) leave();
          }}
        >
          Tchau, Bonzi
        </button>
      </div>
    </section>,
    document.body,
  );
}
