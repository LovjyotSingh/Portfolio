'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type PaletteState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const PaletteContext = createContext<PaletteState | null>(null);

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value: PaletteState = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
  };
  return <PaletteContext value={value}>{children}</PaletteContext>;
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error('usePalette must be used inside <PaletteProvider>');
  return ctx;
}
