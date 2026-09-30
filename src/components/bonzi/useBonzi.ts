'use client';

import { useEffect, useRef, useState } from 'react';
import { BonziEngine, type Bounds } from './engine';

function readBounds(): Bounds {
  const width = window.innerWidth;
  const taskbar = document.querySelector('.site-bottom .w98-taskbar')?.getBoundingClientRect();
  const height = (taskbar?.height ? taskbar.top : window.innerHeight - 32) - 8;
  const reserved = Array.from(
    document.querySelectorAll<HTMLElement>(
      '.site-hero-ctas a, .os-layer a[href*="forms"], .os-layer button[type="submit"]',
    ),
  )
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height)
    .map((rect) => ({
      x: rect.x - 8,
      y: rect.y - 8,
      width: rect.width + 16,
      height: rect.height + 16,
    }));
  return { width, height, reserved };
}

export function useBonzi(greeting: number, held: boolean, bubbleHeld: boolean, onDone: () => void) {
  const [engine] = useState(
    () =>
      new BonziEngine(
        readBounds(),
        Math.random,
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      ),
  );
  const [snapshot, setSnapshot] = useState(() => ({ ...engine.snapshot }));
  const [paused, setPaused] = useState(false);
  const lastGreeting = useRef(greeting);
  const completed = useRef(false);

  useEffect(() => {
    if (greeting !== lastGreeting.current) {
      lastGreeting.current = greeting;
      engine.wave();
    }
  }, [engine, greeting]);

  useEffect(() => {
    let frame = 0;
    let previous = 0;
    let disposed = false;
    const refresh = () => {
      const next = { ...engine.snapshot };
      setSnapshot((current) =>
        Object.keys(next).every(
          (key) => next[key as keyof typeof next] === current[key as keyof typeof next],
        )
          ? current
          : next,
      );
      if (next.done && !completed.current) {
        completed.current = true;
        onDone();
      }
    };
    const tick = (now: number) => {
      if (disposed || document.hidden) return;
      const delta = previous ? Math.min(100, now - previous) : 0;
      previous = now;
      engine.tick(delta, { holdMovement: held || paused, holdBubble: bubbleHeld, paused });
      refresh();
      if (!completed.current) frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      engine.resize(readBounds());
      refresh();
    };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => {
      engine.setReduced(motion.matches);
      refresh();
    };
    const observer = new ResizeObserver(resize);
    const ctas = document.querySelector('.site-hero-ctas');
    if (ctas) observer.observe(ctas);
    const taskbar = document.querySelector('.site-bottom .w98-taskbar');
    if (taskbar) observer.observe(taskbar);
    const windows = document.querySelector('.os-layer');
    const mutations = new MutationObserver(resize);
    if (windows)
      mutations.observe(windows, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['style', 'hidden', 'class'],
      });
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', resize, true);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', preference);
    frame = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', resize, true);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', preference);
    };
  }, [engine, paused, held, bubbleHeld, onDone]);

  return {
    snapshot,
    paused,
    togglePause: () => setPaused((value) => !value),
    speak: () => engine.speak(),
    leave: () => engine.leave(),
  };
}
