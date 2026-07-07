import { useEffect, useState } from 'react';

// Detecta puntero fino (mouse) para habilitar magnetismo / interacción de cursor
// solo en desktop. En touch devuelve false.
export function usePointerCapability() {
  const [finePointer, setFinePointer] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => setFinePointer(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return finePointer;
}
