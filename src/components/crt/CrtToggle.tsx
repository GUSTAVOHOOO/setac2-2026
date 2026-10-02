'use client';

import { useSyncExternalStore } from 'react';
import { PixelIcon } from '@/components/win98/PixelIcon';
import { CRT_STORAGE_KEY } from './bootstrap';

const CRT_CHANGE_EVENT = 'setac:crt-change';
const getSnapshot = () => document.documentElement.dataset.crt !== 'off';
const getServerSnapshot = () => true;

const subscribe = (notify: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== CRT_STORAGE_KEY && event.key !== null) return;
    try {
      if (event.storageArea !== window.localStorage) return;
    } catch {
      return;
    }
    document.documentElement.dataset.crt = event.newValue === 'off' ? 'off' : 'on';
    notify();
  };
  window.addEventListener(CRT_CHANGE_EVENT, notify);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CRT_CHANGE_EVENT, notify);
    window.removeEventListener('storage', onStorage);
  };
};

export function CrtToggle() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = () => {
    const next = getSnapshot() ? 'off' : 'on';
    document.documentElement.dataset.crt = next;
    try {
      localStorage.setItem(CRT_STORAGE_KEY, next);
    } catch {
      // The current tab still works when storage is blocked.
    }
    window.dispatchEvent(new Event(CRT_CHANGE_EVENT));
  };

  return (
    <button type="button" className="crt-toggle" aria-pressed={enabled} onClick={toggle}>
      <PixelIcon src="/icons/computador.svg" size={24} />
      <span>Monitor CRT</span>
      <span className="crt-toggle-state" aria-hidden="true">
        {enabled ? 'Ligado' : 'Desligado'}
      </span>
    </button>
  );
}
