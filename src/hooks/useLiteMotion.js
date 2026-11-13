import { useEffect, useState } from 'react';

// Celulares y tablets (pantalla angosta o táctil). En Safari de iPhone las
// animaciones en bucle traban el scroll, así que ahí se dejan solo las
// animaciones de entrada. Misma condición que las reglas CSS "modo liviano".
export const LITE_MOTION_QUERY =
  '(max-width: 767px), (hover: none) and (pointer: coarse)';

// Devuelve true cuando conviene apagar las animaciones que no se detienen.
export function useLiteMotion() {
  const [lite, setLite] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(LITE_MOTION_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(LITE_MOTION_QUERY);
    const onChange = () => setLite(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return lite;
}
